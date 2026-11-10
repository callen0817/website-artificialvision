# Artificial Vision — Audit and Phased Plan

## 1. Current architecture (VERIFIED)
- Public marketing site: single-page React app on Lovable Cloud, served at artificialviz.com / www.artificialviz.com / artificialviz.lovable.app.
- Backend (this project only): `tool_customers` (download sign-ups), `user_roles` + `has_role()` + `claim_admin()` (admin limited to verified chris@consultc4.com). No payments, subscriptions, AI usage or cost tables exist.
- Admin today: `/admin` page on the same site, email/password sign-in, one "Customers" tab with CSV export.
- AV Pre-VDC is a separate Lovable project with its own backend; this project has no access to its users, billing or AI usage. AV Sort and AV Shift are not present in this project at all (no pages, no data, no project link known).

## 2. Product inventory (VERIFIED from site)
Software: AV Pre-VDC (primary commercial), AV Scan (primary software), AV Structure, AV Snap, AV Segment, AV Splat, AV Walkthrough (In Development), AV Tools (free Revit plugins) containing NF Xplode.
Hardware: scanAR (in development, $15,000 target).
To add: AV Sort, AV Shift (logos supplied).
Naming note: the site and download file say "NF Xplode"; the brief says "AV NF Explode". Plan keeps "NF Xplode" unless told otherwise.

## 3. Existing data sources (VERIFIED)
- `tool_customers`: 1 record (nf-xplode, 1 unique email). This is the only historical download data; it will be preserved and migrated, nothing fabricated.
- No revenue, payment, refund, cost or AI-usage records exist anywhere this project can reach. All financial figures will show Unknown / Unverified until real records are entered or imported.

## 4. Integration dependencies (blockers outside this project)
- AV Pre-VDC, AV Sort, AV Shift users, subscriptions and AI usage live in other projects. Connecting them needs a documented integration contract (each app sends signed events to this admin backend). Those apps must be changed in their own projects; this project will only publish the contract and the receiving endpoint.
- Payment provider (Stripe/Paddle) not connected — revenue/refunds need it or manual/CSV import.
- Lovable development credit history: entered manually or imported from invoices/CSV.
- admin.artificialviz.com: one Lovable project serves one app. The admin will run at `/admin` on this site and the subdomain can be pointed at it (or the admin split into its own project later). Not claimed live until DNS/TLS/login are verified.

## 5. Proposed database changes (additive, no drops)
- `products` (registry: id, name, category, parent_product_id for AV Tools → NF Xplode, logo, page URL, software/hardware, dev/release status, pricing model, subscription/download flags). Seeded from the site.
- `customers` (one global identity per verified email, lower-cased; no name/company merging) + `product_memberships`.
- `download_events` (customer, product, version, timestamp, status, source). Backfilled from `tool_customers`; the existing download form writes both until cut-over.
- `financial_entries` (product, date, type: revenue/refund/direct cost/opex/dev investment/hardware cost subtypes, provider, currency, payment status, cash vs accrual date, verified flag, source).
- `dev_ai_costs` and `runtime_ai_usage` (separate tables, per spec fields).
- `entitlements` + `entitlement_ledger` (grant/reserve/settle/refund/expire, idempotency key unique, per account & product) with server-only functions; AV Sort rules: subscription allowance used first, no rollover; prepaid rolls over.
- `admin_audit_log`.
- All tables: RLS, admin-only read via `has_role`; no public read; entitlement writes only from server functions.

## 6. Security risks and mitigations
- Admin reachable by URL → every query gated by database rules, not just the page.
- Add MFA (authenticator app) required for admin role; audit log of admin actions.
- Public download form currently inserts anonymously → add rate limiting via a server function.
- No provider keys or entitlement functions exposed to the browser.

## 7. Milestones (this project)
- M1 Audit — this document. Status: VERIFIED.
- M8 first (low risk): add AV Sort and AV Shift to AV Suite page and footer with supplied logos, "In Development" status, and simple product pages (`/av-sort`, `/av-shift`) labeled not yet released; homepage featured = AV Pre-VDC, AV Sort, NF Xplode; scanAR removed only from the homepage feature, page kept.
- M2 Registry + global customers + download events, backfill existing record.
- M3 Admin hardening: MFA, audit log, server-side checks.
- M4 Admin UI: Users (searchable, profile drawer), Downloads (AV Tools aggregate + NF Xplode separate, no double count).
- M5 Dashboards: company overview + product performance with filters; Unknown/N/A labeling and completeness indicators.
- M6 Financial entry/import (CSV), dev AI vs runtime AI costs, entitlement ledger with tests for AV Sort rules and cross-account isolation, ROI/break-even math with tests, CSV/XLSX export.
- M7 Integration contract document + receiving endpoint for Pre-VDC/Sort/Shift (changes in those projects listed, not made).
- M9 GUI validation and publish; subdomain only after DNS verified.

Each milestone reported as VERIFIED, IMPLEMENTED BUT UNTESTED, or PASS/CLOSED only after GUI checks.

## Open questions
- Name: keep "NF Xplode" or rename to "AV NF Explode" everywhere?
- AV Sort / AV Shift: release status and any real page/app URL?
- Admin location: `/admin` on this site with the subdomain pointed at it, or a separate admin project?
