create table public.integration_events (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id),
  idempotency_key text not null,
  endpoint text not null,
  event_type text,
  customer_id uuid references public.customers(id),
  status_code int not null,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (product_id, endpoint, idempotency_key)
);
create index on public.integration_events (product_id, created_at);
alter table public.integration_events enable row level security;
create policy "admins read integration events" on public.integration_events for select to authenticated using (public.is_admin_mfa());
grant select on public.integration_events to authenticated;
grant all on public.integration_events to service_role;

create table public.entitlement_reservations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id),
  product_id text not null references public.products(id),
  idempotency_key text not null unique,
  units_reserved numeric not null check (units_reserved > 0),
  units_settled numeric,
  allocations jsonb not null default '[]'::jsonb,
  status text not null default 'reserved' check (status in ('reserved','settled','released','expired')),
  expires_at timestamptz not null default now() + interval '30 minutes',
  created_at timestamptz not null default now(),
  closed_at timestamptz
);
alter table public.entitlement_reservations enable row level security;
create policy "admins read reservations" on public.entitlement_reservations for select to authenticated using (public.is_admin_mfa());
grant select on public.entitlement_reservations to authenticated;
grant all on public.entitlement_reservations to service_role;

-- internal: return units of a reservation to their grants
create or replace function public._return_reservation(_res_id uuid, _units numeric, _action text)
returns void language plpgsql security definer set search_path = public as $$
declare r record; a jsonb; give numeric; left_ numeric := _units;
begin
  select * into r from entitlement_reservations where id = _res_id for update;
  -- return to prepaid/granted first is irrelevant; return in reverse allocation order
  for a in select value from jsonb_array_elements(r.allocations) with ordinality t(value, n) order by n desc loop
    exit when left_ <= 0;
    give := least(left_, (a->>'units')::numeric);
    update entitlement_grants set remaining = remaining + give where id = (a->>'grant_id')::uuid;
    insert into entitlement_ledger (idempotency_key, customer_id, product_id, grant_id, action, units)
      values (r.idempotency_key || ':' || _action || ':' || (a->>'grant_id'), r.customer_id, r.product_id, (a->>'grant_id')::uuid, _action, give);
    left_ := left_ - give;
  end loop;
end $$;

create or replace function public.expire_stale_reservations()
returns int language plpgsql security definer set search_path = public as $$
declare r record; n int := 0;
begin
  for r in select id, units_reserved from entitlement_reservations where status='reserved' and expires_at < now() for update skip locked loop
    perform _return_reservation(r.id, r.units_reserved, 'expire');
    update entitlement_reservations set status='expired', closed_at=now() where id=r.id;
    n := n + 1;
  end loop;
  return n;
end $$;

create or replace function public.reserve_entitlement(_customer uuid, _product text, _units numeric, _key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare need numeric := _units; g record; take numeric; allocs jsonb := '[]'::jsonb; ex record; rid uuid;
begin
  if _units is null or _units <= 0 then raise exception 'units must be positive'; end if;
  select * into ex from entitlement_reservations where idempotency_key = _key;
  if found then
    if ex.customer_id <> _customer or ex.product_id <> _product then raise exception 'idempotency key reused'; end if;
    return jsonb_build_object('ok', true, 'reservation_id', ex.id, 'units_reserved', ex.units_reserved, 'status', ex.status, 'duplicate', true);
  end if;
  perform expire_stale_reservations();
  perform 1 from entitlement_grants where customer_id=_customer and product_id=_product for update;
  if (select coalesce(sum(remaining),0) from entitlement_grants where customer_id=_customer and product_id=_product
      and (kind <> 'subscription' or period_end > now())) < _units then
    return jsonb_build_object('ok', false, 'error', 'insufficient_allowance');
  end if;
  rid := gen_random_uuid();
  for g in select * from entitlement_grants where customer_id=_customer and product_id=_product and remaining > 0
      and (kind <> 'subscription' or period_end > now())
      order by (kind='subscription') desc, period_end nulls last, created_at loop
    exit when need <= 0;
    take := least(need, g.remaining);
    update entitlement_grants set remaining = remaining - take where id = g.id;
    insert into entitlement_ledger (idempotency_key, customer_id, product_id, grant_id, action, units)
      values (_key || ':reserve:' || g.id, _customer, _product, g.id, 'reserve', take);
    allocs := allocs || jsonb_build_array(jsonb_build_object('grant_id', g.id, 'kind', g.kind, 'units', take));
    need := need - take;
  end loop;
  insert into entitlement_reservations (id, customer_id, product_id, idempotency_key, units_reserved, allocations)
    values (rid, _customer, _product, _key, _units, allocs);
  return jsonb_build_object('ok', true, 'reservation_id', rid, 'units_reserved', _units, 'status', 'reserved');
end $$;

create or replace function public.settle_reservation(_res_id uuid, _customer uuid, _product text, _actual numeric)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r record;
begin
  select * into r from entitlement_reservations where id=_res_id and customer_id=_customer and product_id=_product for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if r.status = 'settled' then return jsonb_build_object('ok', true, 'status', 'settled', 'units_settled', r.units_settled, 'duplicate', true); end if;
  if r.status <> 'reserved' then return jsonb_build_object('ok', false, 'error', 'reservation_' || r.status); end if;
  if _actual is null or _actual < 0 or _actual > r.units_reserved then return jsonb_build_object('ok', false, 'error', 'invalid_units'); end if;
  if _actual < r.units_reserved then perform _return_reservation(r.id, r.units_reserved - _actual, 'settle_return'); end if;
  insert into entitlement_ledger (idempotency_key, customer_id, product_id, action, units)
    values (r.idempotency_key || ':settle', _customer, _product, 'settle', _actual);
  update entitlement_reservations set status='settled', units_settled=_actual, closed_at=now() where id=r.id;
  return jsonb_build_object('ok', true, 'status', 'settled', 'units_settled', _actual, 'units_returned', r.units_reserved - _actual);
end $$;

create or replace function public.release_reservation(_res_id uuid, _customer uuid, _product text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r record;
begin
  select * into r from entitlement_reservations where id=_res_id and customer_id=_customer and product_id=_product for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if r.status = 'released' then return jsonb_build_object('ok', true, 'status', 'released', 'duplicate', true); end if;
  if r.status <> 'reserved' then return jsonb_build_object('ok', false, 'error', 'reservation_' || r.status); end if;
  perform _return_reservation(r.id, r.units_reserved, 'release');
  update entitlement_reservations set status='released', closed_at=now() where id=r.id;
  return jsonb_build_object('ok', true, 'status', 'released', 'units_returned', r.units_reserved);
end $$;

create or replace function public.entitlement_balance(_customer uuid, _product text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'subscription', coalesce(sum(remaining) filter (where kind='subscription' and period_end > now()),0),
    'prepaid', coalesce(sum(remaining) filter (where kind='prepaid'),0),
    'granted', coalesce(sum(remaining) filter (where kind='granted'),0),
    'subscription_period_end', max(period_end) filter (where kind='subscription' and period_end > now()))
  from entitlement_grants where customer_id=_customer and product_id=_product;
$$;

revoke all on function public._return_reservation(uuid,numeric,text), public.expire_stale_reservations(), public.reserve_entitlement(uuid,text,numeric,text),
  public.settle_reservation(uuid,uuid,text,numeric), public.release_reservation(uuid,uuid,text), public.entitlement_balance(uuid,text),
  public.consume_entitlement(uuid,text,numeric,text) from public, anon, authenticated;
grant execute on function public.reserve_entitlement(uuid,text,numeric,text), public.settle_reservation(uuid,uuid,text,numeric),
  public.release_reservation(uuid,uuid,text), public.entitlement_balance(uuid,text), public.expire_stale_reservations() to service_role;