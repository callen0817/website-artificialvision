create trigger tool_customers_sync after insert on public.tool_customers for each row execute function public.sync_tool_download();
insert into public.customers (email, name, company, consent_at, last_activity_at)
select distinct on (lower(trim(email))) lower(trim(email)), name, company, created_at, created_at from public.tool_customers order by lower(trim(email)), created_at desc
on conflict (email) do nothing;
insert into public.download_events (customer_id, product_id, status, source, legacy_tool_customer_id, name_at_download, company_at_download, created_at)
select c.id, t.tool_id, 'requested', 'website_form (backfill)', t.id, t.name, t.company, t.created_at
from public.tool_customers t join public.customers c on c.email = lower(trim(t.email))
on conflict (legacy_tool_customer_id) do nothing;