# Connecting AV Synthesis to the Artificial Vision admin

Paste this into the AV Synthesis project. It uses the same signed contract as AV Sort (see admin-integration-contract.md), with `X-AV-Product: av-synthesis`.

1. Turn on Lovable Cloud (if not already) and add secrets:
   - `AV_ADMIN_BASE_URL` = `https://iabhbgwyawofzqqooyhh.supabase.co/functions/v1/av-admin-api`
   - `AV_ADMIN_SIGNING_SECRET` = same value saved as `AV_SYNTHESIS_SIGNING_SECRET` in the admin project.
2. Create one server-side function (never the browser) that signs requests:
   `X-AV-Product: av-synthesis`, `X-AV-Timestamp` (unix seconds), `X-AV-Signature: sha256=hex(HMAC_SHA256(secret, timestamp + "." + rawBody))`, `Idempotency-Key` (unique per event, e.g. `ai:<usage-row-id>`).
3. Send `POST /events`:
   - On sign-up / email confirm: `{ "type": "user.registered", "email", "email_verified": true, "data": { "name", "company" } }`
   - After every AI call: `{ "type": "ai.usage", "email", "occurred_at", "data": { provider, model, operation, input_tokens, output_tokens, provider_units, provider_cost, billing_units, allowance_consumed, job_status } }` — counts and costs only, no file names, project names or content.
4. One-time backfill: for each existing user send `user.registered`, then each past AI usage record as `ai.usage` with its original `occurred_at` and a stable Idempotency-Key, so re-running never duplicates.
