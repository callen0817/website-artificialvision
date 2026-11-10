create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.claim_admin()
returns boolean language plpgsql security definer set search_path = public
as $$
declare u record;
begin
  select id, email, email_confirmed_at into u from auth.users where id = auth.uid();
  if u.id is null or u.email_confirmed_at is null or lower(u.email) <> 'chris@consultc4.com' then
    return public.has_role(auth.uid(), 'admin');
  end if;
  insert into public.user_roles (user_id, role) values (u.id, 'admin') on conflict do nothing;
  return true;
end $$;
revoke execute on function public.claim_admin() from public, anon;
grant execute on function public.claim_admin() to authenticated;

create table public.tool_customers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  company text not null check (char_length(company) between 1 and 200),
  email text not null check (char_length(email) between 3 and 255 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  tool_id text not null check (char_length(tool_id) between 1 and 100),
  created_at timestamptz not null default now()
);
grant insert on public.tool_customers to anon, authenticated;
grant select, delete on public.tool_customers to authenticated;
grant all on public.tool_customers to service_role;
alter table public.tool_customers enable row level security;
create policy "Anyone can register a download" on public.tool_customers for insert to anon, authenticated with check (true);
create policy "Admins read customers" on public.tool_customers for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete customers" on public.tool_customers for delete to authenticated using (public.has_role(auth.uid(), 'admin'));