# Admin integration contract (AV Sort first; AV Synthesis / AV Shift later)

Status: RECEIVER DEPLOYED. AV Sort signing secret pending; not yet tested end-to-end.

Base URL: `https://iabhbgwyawofzqqooyhh.supabase.co/functions/v1/av-admin-api`
(admin.artificialviz.com is not live; do not use it until DNS is verified.)

Every request (server-to-server only):
- `X-AV-Product: av-sort`
- `X-AV-Timestamp`: unix seconds, rejected if >300s skew
- `X-AV-Signature: sha256=<hex HMAC-SHA256(secret, timestamp + "." + payload)>` where payload = raw body for POST, and the query string including `?` for GET
- `Idempotency-Key` (POST, required, ≤200 chars). Duplicates return the original status and result with `duplicate: true`.
- Rate limit: 600 requests/min per product → 429.

Routes:
- `POST /events` body `{ type, occurred_at?, email, email_verified?, data? }`. Unknown fields rejected (400).
  - `user.registered` data `{name?, company?}`; `user.verified`, `user.login` no data
  - `session.processed` counts only: docs, sheets, ocr_sheets, auto_recognized, manual_corrections, exports, errors
  - `subscription.changed` `{tier?, status?, allowance_units?, period_end?}` — allowance + period_end creates a non-rollover subscription grant
  - `payment.succeeded` `{amount, currency, provider, payment_id, prepaid_units?}` — prepaid_units creates a rollover prepaid grant; revenue recorded unverified
  - `payment.refunded` `{amount, currency, provider, payment_id}`
  - `ai.usage` `{provider, model, operation, input_tokens, output_tokens, provider_units, provider_cost, billing_units, allowance_consumed, job_status}`
- `POST /entitlements/reserve` `{email, units}` → 200 `{reservation_id, units_reserved}` or 402 `insufficient_allowance`. Subscription allowance first, then prepaid/granted. Reservations expire after 30 min.
- `POST /entitlements/settle` `{email, reservation_id, units}` (units ≤ reserved; remainder returned)
- `POST /entitlements/release` `{email, reservation_id}`
- `GET /entitlements/balance?email=` → `{subscription, prepaid, granted, subscription_period_end}`

Identity: verified email only, lower-cased; never merged by name/company. Reservations are bound to customer + product, so one account can't spend another's allowance and AV Sort units never apply to other products.

Secrets in this project: `AV_SORT_SIGNING_SECRET` (same value as AV Sort's `AV_ADMIN_SIGNING_SECRET`).
