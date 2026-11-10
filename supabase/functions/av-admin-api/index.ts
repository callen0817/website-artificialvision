// Receiving service for product apps (AV Sort first). Server-to-server only.
// Routes (under /functions/v1/av-admin-api):
//   POST /events, POST /entitlements/reserve|settle|release, GET /entitlements/balance?email=
// Auth: X-AV-Product, X-AV-Timestamp, X-AV-Signature: sha256=hex(HMAC(secret, ts + "." + rawBody)), Idempotency-Key.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac, timingSafeEqual } from "node:crypto";

const SECRETS: Record<string, string | undefined> = {
  "av-sort": Deno.env.get("AV_SORT_SIGNING_SECRET"),
  "av-synthesis": Deno.env.get("AV_SYNTHESIS_SIGNING_SECRET"),
};
const RATE_LIMIT_PER_MIN = 600;
const MAX_SKEW = 300;

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const COUNT_KEYS = ["docs", "sheets", "ocr_sheets", "auto_recognized", "manual_corrections", "exports", "errors"];
const DATA_SCHEMA: Record<string, Record<string, "string" | "number" | "boolean">> = {
  "user.registered": { name: "string", company: "string" },
  "user.verified": {},
  "user.login": {},
  "session.processed": Object.fromEntries(COUNT_KEYS.map((k) => [k, "number"])) as Record<string, "number">,
  "subscription.changed": { tier: "string", status: "string", allowance_units: "number", period_end: "string" },
  "payment.succeeded": { amount: "number", currency: "string", provider: "string", payment_id: "string", prepaid_units: "number" },
  "payment.refunded": { amount: "number", currency: "string", provider: "string", payment_id: "string" },
  "ai.usage": {
    provider: "string", model: "string", operation: "string", input_tokens: "number", output_tokens: "number",
    provider_units: "number", provider_cost: "number", billing_units: "number", allowance_consumed: "number", job_status: "string",
  },
};
const TOP_KEYS = new Set(["type", "occurred_at", "email", "email_verified", "data"]);

function verify(req: Request, raw: string): { product: string } | Response {
  const product = req.headers.get("x-av-product") ?? "";
  const secret = SECRETS[product];
  if (!secret) return json(401, { error: "unknown_product" });
  const ts = Number(req.headers.get("x-av-timestamp"));
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > MAX_SKEW) return json(401, { error: "stale_timestamp" });
  const sig = (req.headers.get("x-av-signature") ?? "").replace(/^sha256=/, "");
  // GET query strings may be re-encoded by the gateway; accept the decoded form too.
  const candidates = req.method === "GET" ? [raw, decodeURIComponent(raw)] : [raw];
  const a = new TextEncoder().encode(sig);
  const ok = candidates.some((c) => {
    const b = new TextEncoder().encode(createHmac("sha256", secret).update(`${ts}.${c}`).digest("hex"));
    return a.length === b.length && timingSafeEqual(a, b);
  });
  if (!ok) return json(401, { error: "bad_signature" });
  return { product };
}

function validateEvent(body: any): string | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "body must be an object";
  for (const k of Object.keys(body)) if (!TOP_KEYS.has(k)) return `unexpected field: ${k}`;
  const schema = DATA_SCHEMA[body.type];
  if (!schema) return "unknown type";
  if (typeof body.email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email) || body.email.length > 255) return "invalid email";
  if (body.email_verified !== undefined && typeof body.email_verified !== "boolean") return "invalid email_verified";
  if (body.occurred_at !== undefined && isNaN(Date.parse(body.occurred_at))) return "invalid occurred_at";
  const data = body.data ?? {};
  if (typeof data !== "object" || Array.isArray(data)) return "data must be an object";
  for (const [k, v] of Object.entries(data)) {
    const t = schema[k];
    if (!t) return `unexpected data field: ${k}`;
    if (typeof v !== t) return `invalid type for ${k}`;
    if (t === "string" && (v as string).length > 200) return `${k} too long`;
    if (t === "number" && (!Number.isFinite(v) || (v as number) < 0)) return `invalid ${k}`;
  }
  return null;
}

async function customerFor(email: string, verified?: boolean, extra: { name?: string; company?: string } = {}) {
  const e = email.trim().toLowerCase();
  const { data: existing } = await db.from("customers").select("id, email_verified").eq("email", e).maybeSingle();
  if (existing) {
    const patch: Record<string, unknown> = { last_activity_at: new Date().toISOString() };
    if (verified && !existing.email_verified) patch.email_verified = true;
    await db.from("customers").update(patch).eq("id", existing.id);
    return existing.id as string;
  }
  const { data, error } = await db.from("customers")
    .insert({ email: e, email_verified: !!verified, name: extra.name ?? null, company: extra.company ?? null, last_activity_at: new Date().toISOString() })
    .select("id").single();
  if (error) throw error;
  return data.id as string;
}

async function ensureMembership(customer: string, product: string, tier?: string, status?: string) {
  const { data } = await db.from("product_memberships").select("id").eq("customer_id", customer).eq("product_id", product).maybeSingle();
  if (data) {
    const patch: Record<string, unknown> = {};
    if (tier) patch.tier = tier;
    if (status) patch.status = status;
    if (Object.keys(patch).length) await db.from("product_memberships").update(patch).eq("id", data.id);
  } else {
    await db.from("product_memberships").insert({ customer_id: customer, product_id: product, tier: tier ?? null, status: status ?? "active" });
  }
}

async function handleEvent(product: string, body: any, customer: string) {
  const d = body.data ?? {};
  const date = (body.occurred_at ?? new Date().toISOString()).slice(0, 10);
  switch (body.type) {
    case "user.registered": case "user.verified": case "user.login":
      await ensureMembership(customer, product);
      return { recorded: body.type };
    case "session.processed":
      return { recorded: "session.processed", counts: Object.fromEntries(COUNT_KEYS.map((k) => [k, d[k] ?? 0])) };
    case "subscription.changed": {
      await ensureMembership(customer, product, d.tier, d.status);
      if (d.allowance_units && d.period_end) {
        await db.from("entitlement_grants").insert({
          customer_id: customer, product_id: product, kind: "subscription", units: d.allowance_units, remaining: d.allowance_units, period_end: d.period_end,
        });
      }
      return { recorded: "subscription.changed" };
    }
    case "payment.succeeded": case "payment.refunded": {
      const refund = body.type === "payment.refunded";
      await db.from("financial_entries").insert({
        product_id: product, customer_id: customer, entry_type: refund ? "refund" : "revenue", amount: d.amount ?? null,
        currency: d.currency ?? null, accrual_date: date, cash_date: date, provider: d.provider ?? null,
        payment_status: refund ? "refunded" : "paid", verified: false, source: `${product} event ${d.payment_id ?? ""}`.trim(),
      });
      if (!refund && d.prepaid_units) {
        await db.from("entitlement_grants").insert({ customer_id: customer, product_id: product, kind: "prepaid", units: d.prepaid_units, remaining: d.prepaid_units });
      }
      return { recorded: body.type };
    }
    case "ai.usage":
      await db.from("runtime_ai_usage").insert({ product_id: product, customer_id: customer, ...d, verified: false });
      return { recorded: "ai.usage" };
  }
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.replace(/^.*\/av-admin-api/, "") || "/";
  const raw = req.method === "GET" ? "" : await req.text();
  const signed = verify(req, req.method === "GET" ? url.search : raw);
  if (signed instanceof Response) return signed;
  const { product } = signed;

  const since = new Date(Date.now() - 60_000).toISOString();
  const { count } = await db.from("integration_events").select("id", { count: "exact", head: true }).eq("product_id", product).gte("created_at", since);
  if ((count ?? 0) >= RATE_LIMIT_PER_MIN) return json(429, { error: "rate_limited" });

  const key = req.headers.get("idempotency-key") ?? "";
  if (req.method === "POST" && (!key || key.length > 200)) return json(400, { error: "missing Idempotency-Key" });

  if (req.method === "POST") {
    const { data: dup } = await db.from("integration_events").select("status_code, result")
      .eq("product_id", product).eq("endpoint", route).eq("idempotency_key", key).maybeSingle();
    if (dup) return json(dup.status_code, { ...(dup.result as object), duplicate: true });
  }

  let body: any = {};
  if (raw) { try { body = JSON.parse(raw); } catch { return json(400, { error: "invalid json" }); } }

  let status = 200, result: any, customer: string | null = null, eventType: string | null = null;
  try {
    if (req.method === "POST" && route === "/events") {
      const err = validateEvent(body);
      if (err) return json(400, { error: err });
      eventType = body.type;
      customer = await customerFor(body.email, body.email_verified, body.data);
      result = await handleEvent(product, body, customer);
    } else if (route.startsWith("/entitlements/")) {
      const email = req.method === "GET" ? url.searchParams.get("email") : body.email;
      if (typeof email !== "string" || !email.includes("@")) return json(400, { error: "invalid email" });
      const { data: c } = await db.from("customers").select("id").eq("email", email.trim().toLowerCase()).maybeSingle();
      if (!c) return json(404, { error: "unknown_customer" });
      customer = c.id;
      eventType = route.slice(1);
      if (req.method === "GET" && route === "/entitlements/balance") {
        const { data, error } = await db.rpc("entitlement_balance", { _customer: c.id, _product: product });
        if (error) throw error;
        return json(200, data);
      } else if (req.method === "POST" && route === "/entitlements/reserve") {
        const { data, error } = await db.rpc("reserve_entitlement", { _customer: c.id, _product: product, _units: Number(body.units), _key: `${product}:${key}` });
        if (error) throw error;
        result = data; status = (data as any).ok ? 200 : 402;
      } else if (req.method === "POST" && route === "/entitlements/settle") {
        const { data, error } = await db.rpc("settle_reservation", { _res_id: body.reservation_id, _customer: c.id, _product: product, _actual: Number(body.units) });
        if (error) throw error;
        result = data; status = (data as any).ok ? 200 : 409;
      } else if (req.method === "POST" && route === "/entitlements/release") {
        const { data, error } = await db.rpc("release_reservation", { _res_id: body.reservation_id, _customer: c.id, _product: product });
        if (error) throw error;
        result = data; status = (data as any).ok ? 200 : 409;
      } else return json(404, { error: "not_found" });
    } else return json(404, { error: "not_found" });
  } catch (e) {
    console.error(route, e);
    return json(500, { error: "server_error" });
  }

  await db.from("integration_events").insert({ product_id: product, idempotency_key: key, endpoint: route, event_type: eventType, customer_id: customer, status_code: status, result });
  await db.from("admin_audit_log").insert({ action: `integration:${product}:${route}`, detail: { event_type: eventType, status, customer_id: customer } });
  return json(status, result);
});
