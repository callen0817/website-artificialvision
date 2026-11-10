export type Product = { id: string; name: string; parent_product_id: string | null; classification: string };
export type DownloadEvent = { id: string; customer_id: string; product_id: string; created_at: string };
export type FinEntry = { product_id: string | null; entry_type: string; amount: number; verified: boolean; accrual_date: string };

/** Memberships identify app customers even when they have never downloaded a tool. */
export function customerProductIds(customerId: string, sources: { customer_id: string | null; product_id: string | null }[][], ids: Set<string>): Set<string> {
  return new Set(sources.flat().filter(r => r.customer_id === customerId && r.product_id !== null && ids.has(r.product_id)).map(r => r.product_id).filter((id): id is string => id !== null));
}

/** Product ids covered by a filter: a collection includes its child products. "all" = every product. */
export function scopeIds(products: Product[], filter: string): Set<string> {
  if (filter === "all") return new Set(products.map(p => p.id));
  if (filter === "software" || filter === "hardware") {
    const base = products.filter(p => p.classification === filter || (filter === "software" && p.classification === "collection"));
    return new Set(base.flatMap(p => [p.id, ...products.filter(c => c.parent_product_id === p.id).map(c => c.id)]));
  }
  return new Set([filter, ...products.filter(p => p.parent_product_id === filter).map(p => p.id)]);
}

/** Each event counted once, so a child product rolls into its collection without double counting. */
export function downloadStats(events: DownloadEvent[], ids: Set<string>) {
  const scoped = events.filter(e => ids.has(e.product_id));
  const unique = new Set(scoped.map(e => e.customer_id)).size;
  return { downloads: scoped.length, uniqueDownloaders: unique, repeatDownloads: scoped.length - unique };
}

export function financialSummary(entries: FinEntry[], ids: Set<string> | null) {
  const scoped = entries.filter(e => ids === null || (e.product_id ? ids.has(e.product_id) : false));
  const sum = (t: string) => scoped.filter(e => e.entry_type === t).reduce((a, e) => a + Number(e.amount), 0);
  const revenue = sum("revenue"), refunds = sum("refund");
  const direct = sum("direct_cost") + sum("hardware_cost"), opex = sum("operating_expense"), dev = sum("development_investment");
  const netRevenue = revenue - refunds, gross = netRevenue - direct, operating = gross - opex;
  return {
    hasData: scoped.length > 0,
    allVerified: scoped.length > 0 && scoped.every(e => e.verified),
    revenue, refunds, netRevenue, direct, gross,
    grossMargin: netRevenue > 0 ? gross / netRevenue : null,
    opex, operating, dev,
    cumulativeCash: operating - dev,
    roi: dev > 0 ? (operating - dev) / dev : null,
    breakEven: dev > 0 || opex > 0 ? operating - dev >= 0 : null,
  };
}

type AiRow = { customer_id: string | null; product_id: string; input_tokens?: number | null; output_tokens?: number | null; billing_units?: number | null; provider_cost?: number | null };
/** Groups runtime AI usage per customer; cost stays "unknown" unless every row reported one. */
export function aiUsageByUser(rows: AiRow[]) {
  const m = new Map<string | null, { customer_id: string | null; products: string[]; requests: number; inputTokens: number; outputTokens: number; credits: number; cost: number; costKnown: boolean }>();
  for (const r of rows) {
    const u = m.get(r.customer_id) ?? { customer_id: r.customer_id, products: [], requests: 0, inputTokens: 0, outputTokens: 0, credits: 0, cost: 0, costKnown: true };
    if (!u.products.includes(r.product_id)) u.products.push(r.product_id);
    u.requests++; u.inputTokens += Number(r.input_tokens ?? 0); u.outputTokens += Number(r.output_tokens ?? 0);
    u.credits += Number(r.billing_units ?? 0);
    if (r.provider_cost == null) u.costKnown = false; else u.cost += Number(r.provider_cost);
    m.set(r.customer_id, u);
  }
  return [...m.values()].sort((a, b) => b.credits - a.credits);
}

export type Membership = { customer_id: string; product_id: string; status: string; started_at: string };
type Customer = { id: string; created_at: string; last_activity_at?: string | null };
type Association = { customer_id: string | null; product_id: string | null; created_at?: string; started_at?: string; accrual_date?: string };
export function customerLifecycle(customerId: string, memberships: Membership[], ids: Set<string>) {
  const rows = memberships.filter(m => m.customer_id === customerId && ids.has(m.product_id));
  if (rows.some(m => m.status === "active")) return "active";
  if (rows.length && rows.every(m => ["deleted", "archived"].includes(m.status))) return "archived";
  return "unknown";
}

export function customerJoinedAt(customer: Customer, memberships: Membership[], ids: Set<string>, all: boolean) {
  if (all) return customer.created_at;
  return memberships.filter(m => m.customer_id === customer.id && ids.has(m.product_id)).map(m => m.started_at).sort()[0] ?? null;
}

export function overviewUsers(customers: Customer[], sources: Association[][], entries: (Association & { entry_type: string })[], ids: Set<string>, all: boolean, activeSince: string) {
  const scoped = customers.filter(c => all || customerProductIds(c.id, sources, ids).size > 0);
  const customerIds = new Set(scoped.map(c => c.id));
  const paying = new Set(entries.filter(e => e.entry_type === "revenue" && e.customer_id && customerIds.has(e.customer_id) && (all || (e.product_id !== null && ids.has(e.product_id)))).map(e => e.customer_id));
  return { unique: scoped.length, paying: paying.size, free: scoped.length - paying.size,
    active: scoped.filter(c => all ? c.last_activity_at && c.last_activity_at >= activeSince : sources.flat().some(r => r.customer_id === c.id && r.product_id !== null && ids.has(r.product_id) && (r.created_at ?? r.started_at ?? r.accrual_date ?? "") >= activeSince)).length };
}

export type UsagePeriod = "day" | "week" | "month" | "30days" | "6mo" | "year" | "all";
export type DatedAiRow = AiRow & { id?: string; created_at: string; operation?: string | null; model?: string | null };
export function usageWindow(anchor: string, period: UsagePeriod, rows: DatedAiRow[] = []) {
  const date = new Date(`${anchor}T00:00:00Z`);
  if (period === "all") {
    const dates = rows.map(r => new Date(r.created_at).getTime()).filter(Number.isFinite);
    const first = new Date(dates.length ? Math.min(...dates) : date);
    const last = new Date(dates.length ? Math.max(...dates) : date);
    return { start: new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1)), end: new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth() + 1, 1)) };
  }
  if (period === "week" || period === "30days") {
    const start = new Date(date);
    start.setUTCDate(start.getUTCDate() - (period === "week" ? (start.getUTCDay() + 6) % 7 : 29));
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + (period === "week" ? 7 : 30));
    return { start, end };
  }
  const start = period === "day" ? date : new Date(Date.UTC(date.getUTCFullYear(), period === "year" ? 0 : date.getUTCMonth(), 1));
  const end = new Date(start);
  if (period === "day") end.setUTCDate(end.getUTCDate() + 1);
  else end.setUTCMonth(end.getUTCMonth() + (period === "month" ? 1 : period === "6mo" ? 6 : 12));
  return { start, end };
}

export function usageSeries(rows: DatedAiRow[], anchor: string, period: UsagePeriod) {
  const { start, end } = usageWindow(anchor, period, rows);
  const daily = ["month", "week", "30days"].includes(period);
  const buckets: { date: string; credits: number; tokens: number }[] = [];
  const cursor = new Date(start);
  while (cursor < end) {
    buckets.push({ date: cursor.toISOString(), credits: 0, tokens: 0 });
    if (period === "day") cursor.setUTCHours(cursor.getUTCHours() + 1);
    else if (daily) cursor.setUTCDate(cursor.getUTCDate() + 1);
    else cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  for (const row of rows) {
    const d = new Date(row.created_at);
    if (!(d >= start && d < end)) continue;
    const index = period === "day" ? d.getUTCHours() : daily ? Math.floor((d.getTime() - start.getTime()) / 86400000) : (d.getUTCFullYear() - start.getUTCFullYear()) * 12 + d.getUTCMonth() - start.getUTCMonth();
    if (buckets[index]) {
      buckets[index].credits += Number(row.billing_units ?? 0);
      buckets[index].tokens += Number(row.input_tokens ?? 0) + Number(row.output_tokens ?? 0);
    }
  }
  return buckets;
}

export function creditTicks(max: number) {
  return Array.from({ length: Math.max(1, Math.ceil(max / 100)) + 1 }, (_, i) => i * 100);
}
