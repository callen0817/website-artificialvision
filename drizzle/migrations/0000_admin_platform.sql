create or replace function public.is_admin_mfa()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin') and coalesce(auth.jwt()->>'aal','') = 'aal2'
$$;

create table public.products (
  id text primary key,
  name text not null,
  category text not null,
  parent_product_id text references public.products(id),
  logo_url text,
  page_url text,
  classification text not null check (classification in ('software','hardware','collection')),
  development_status text not null default 'Unknown',
  release_status text not null default 'Unknown',
  pricing_model text not null default 'Unknown',
  subscription_available boolean not null default false,
  download_available boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  company text,
  email_verified boolean not null default false,
  auth_user_id uuid unique,
  consent_at timestamptz,
  created_at timestamptz not null default now(),
  last_activity_at timestamptz
);

create table public.product_memberships (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  product_id text not null references public.products(id),
  tier text, status text not null default 'active',
  started_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

create table public.download_events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  product_id text not null references public.products(id),
  version text, status text not null default 'requested',
  source text, legacy_tool_customer_id uuid unique,
  name_at_download text, company_at_download text,
  created_at timestamptz not null default now()
);

create table public.financial_entries (
  id uuid primary key default gen_random_uuid(),
  product_id text references public.products(id),
  customer_id uuid references public.customers(id),
  entry_type text not null check (entry_type in ('revenue','refund','direct_cost','operating_expense','development_investment','hardware_cost')),
  subcategory text,
  amount numeric(14,2) not null,
  currency text not null default 'USD',
  accrual_date date not null,
  cash_date date,
  provider text, milestone text,
  payment_status text not null default 'unknown',
  verified boolean not null default false,
  source text, notes text,
  created_by uuid, created_at timestamptz not null default now()
);

create table public.runtime_ai_usage (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id),
  customer_id uuid references public.customers(id),
  provider text not null, model text, operation text,
  input_tokens bigint, output_tokens bigint,
  provider_units numeric, provider_cost numeric(14,6),
  billing_units numeric, allowance_consumed numeric,
  job_status text, verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.entitlement_grants (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  product_id text not null references public.products(id),
  kind text not null check (kind in ('subscription','prepaid','granted')),
  units numeric not null check (units >= 0),
  remaining numeric not null check (remaining >= 0),
  period_end timestamptz,
  created_at timestamptz not null default now()
);

create table public.entitlement_ledger (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  customer_id uuid not null references public.customers(id),
  product_id text not null references public.products(id),
  grant_id uuid references public.entitlement_grants(id),
  action text not null,
  units numeric not null,
  created_at timestamptz not null default now()
);

create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor uuid, action text not null, detail jsonb,
  created_at timestamptz not null default now()
);

grant select on public.products, public.customers, public.product_memberships, public.download_events, public.financial_entries, public.runtime_ai_usage, public.entitlement_grants, public.entitlement_ledger, public.admin_audit_log to authenticated;
grant insert, update, delete on public.products, public.financial_entries to authenticated;
grant insert on public.admin_audit_log to authenticated;
grant all on public.products, public.customers, public.product_memberships, public.download_events, public.financial_entries, public.runtime_ai_usage, public.entitlement_grants, public.entitlement_ledger, public.admin_audit_log to service_role;

alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.product_memberships enable row level security;
alter table public.download_events enable row level security;
alter table public.financial_entries enable row level security;
alter table public.runtime_ai_usage enable row level security;
alter table public.entitlement_grants enable row level security;
alter table public.entitlement_ledger enable row level security;
alter table public.admin_audit_log enable row level security;

create policy "admin read" on public.products for select to authenticated using (public.is_admin_mfa());
create policy "admin write" on public.products for insert to authenticated with check (public.is_admin_mfa());
create policy "admin update" on public.products for update to authenticated using (public.is_admin_mfa());
create policy "admin read" on public.customers for select to authenticated using (public.is_admin_mfa());
create policy "admin read" on public.product_memberships for select to authenticated using (public.is_admin_mfa());
create policy "admin read" on public.download_events for select to authenticated using (public.is_admin_mfa());
create policy "admin read" on public.financial_entries for select to authenticated using (public.is_admin_mfa());
create policy "admin write" on public.financial_entries for insert to authenticated with check (public.is_admin_mfa());
create policy "admin delete" on public.financial_entries for delete to authenticated using (public.is_admin_mfa());
create policy "admin read" on public.runtime_ai_usage for select to authenticated using (public.is_admin_mfa());
create policy "admin read" on public.entitlement_grants for select to authenticated using (public.is_admin_mfa());
create policy "admin read" on public.entitlement_ledger for select to authenticated using (public.is_admin_mfa());
create policy "admin read" on public.admin_audit_log for select to authenticated using (public.is_admin_mfa());
create policy "admin write" on public.admin_audit_log for insert to authenticated with check (public.is_admin_mfa() and actor = auth.uid());

-- Mirror the existing public download form into the central identity + events (form unchanged)
create or replace function public.sync_tool_download()
returns trigger language plpgsql security definer set search_path = public as $$
declare cid uuid;
begin
  insert into public.customers (email, name, company, consent_at, last_activity_at)
  values (lower(trim(new.email)), new.name, new.company, new.created_at, new.created_at)
  on conflict (email) do update set last_activity_at = greatest(customers.last_activity_at, excluded.last_activity_at)
  returning id into cid;
  insert into public.download_events (customer_id, product_id, status, source, legacy_tool_customer_id, name_at_download, company_at_download, created_at)
  values (cid, new.tool_id, 'requested', 'website_form', new.id, new.name, new.company, new.created_at)
  on conflict (legacy_tool_customer_id) do nothing;
  return new;
end $$;

-- Server-only atomic, idempotent consumption: subscription (unexpired) first, then prepaid/granted
create or replace function public.consume_entitlement(_customer uuid, _product text, _units numeric, _key text)
returns boolean language plpgsql security definer set search_path = public as $$
declare need numeric := _units; g record; take numeric;
begin
  if _units <= 0 then raise exception 'units must be positive'; end if;
  if exists (select 1 from entitlement_ledger where idempotency_key = _key) then return true; end if;
  if (select coalesce(sum(remaining),0) from entitlement_grants where customer_id=_customer and product_id=_product
      and (kind <> 'subscription' or period_end > now())) < _units then return false; end if;
  for g in select * from entitlement_grants where customer_id=_customer and product_id=_product and remaining > 0
      and (kind <> 'subscription' or period_end > now())
      order by (kind='subscription') desc, created_at for update loop
    exit when need <= 0;
    take := least(need, g.remaining);
    update entitlement_grants set remaining = remaining - take where id = g.id;
    insert into entitlement_ledger (idempotency_key, customer_id, product_id, grant_id, action, units)
      values (case when need = _units then _key else _key || ':' || g.id end, _customer, _product, g.id, 'consume', take);
    need := need - take;
  end loop;
  return true;
end $$;
revoke execute on function public.consume_entitlement(uuid, text, numeric, text) from public, anon, authenticated;
revoke execute on function public.sync_tool_download() from public, anon, authenticated;