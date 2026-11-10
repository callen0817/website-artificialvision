import { expect, test } from "bun:test";
import { scopeIds, downloadStats, financialSummary, customerProductIds, aiUsageByUser, overviewUsers, customerLifecycle, customerJoinedAt, usageSeries, creditTicks } from "./adminMetrics";

const products = [
  { id: "av-tools", name: "AV Tools", parent_product_id: null, classification: "collection" },
  { id: "nf-xplode", name: "NF Xplode", parent_product_id: "av-tools", classification: "software" },
  { id: "scanar", name: "scanAR", parent_product_id: null, classification: "hardware" },
];
const events = [
  { id: "1", customer_id: "a", product_id: "nf-xplode", created_at: "" },
  { id: "2", customer_id: "a", product_id: "nf-xplode", created_at: "" },
  { id: "3", customer_id: "b", product_id: "nf-xplode", created_at: "" },
];

test("NF Xplode downloads roll into AV Tools", () => {
  expect(downloadStats(events, scopeIds(products, "av-tools")).downloads).toBe(3);
});
test("company totals do not double count NF Xplode", () => {
  expect(downloadStats(events, scopeIds(products, "all")).downloads).toBe(3);
});
test("unique and repeat downloaders", () => {
  const s = downloadStats(events, scopeIds(products, "nf-xplode"));
  expect(s.uniqueDownloaders).toBe(2);
  expect(s.repeatDownloads).toBe(1);
});
test("hardware filter excludes software downloads", () => {
  expect(downloadStats(events, scopeIds(products, "hardware")).downloads).toBe(0);
});
test("ROI = (operating profit - development investment) / development investment", () => {
  const f = financialSummary([
    { product_id: "scanar", entry_type: "revenue", amount: 1000, verified: true, accrual_date: "" },
    { product_id: "scanar", entry_type: "refund", amount: 100, verified: true, accrual_date: "" },
    { product_id: "scanar", entry_type: "direct_cost", amount: 300, verified: true, accrual_date: "" },
    { product_id: "scanar", entry_type: "development_investment", amount: 200, verified: true, accrual_date: "" },
  ], null);
  expect(f.gross).toBe(600);
  expect(f.roi).toBe(2);
});
test("no records means unknown, not zero", () => {
  const f = financialSummary([], null);
  expect(f.hasData).toBe(false);
  expect(f.roi).toBe(null);
});

test("AV Sort registration shows its product without a download", () => {
  expect([...customerProductIds("sort-customer", [[{ customer_id: "sort-customer", product_id: "av-sort" }], []], new Set(["av-sort"]))]).toEqual(["av-sort"]);
});
test("customer products deduplicate sources and respect product and customer filters", () => {
  const records = [{ customer_id: "a", product_id: "av-sort" }, { customer_id: "a", product_id: "nf-xplode" }, { customer_id: "b", product_id: "av-shift" }];
  expect([...customerProductIds("a", [records, records], new Set(["av-sort", "av-shift"]))]).toEqual(["av-sort"]);
});
test("AI usage groups per user and sums credits", () => {
  const r = aiUsageByUser([{ customer_id: "a", product_id: "av-synthesis", billing_units: 3, provider_cost: 0.1 }, { customer_id: "a", product_id: "av-synthesis", billing_units: 2, provider_cost: null }, { customer_id: "b", product_id: "av-sort", billing_units: 1, provider_cost: 0.2 }]);
  expect(r[0].customer_id).toBe("a"); expect(r[0].credits).toBe(5); expect(r[0].requests).toBe(2); expect(r[0].costKnown).toBe(false);
});

test("overview unique, paying, free and active users follow the selected product", () => {
  const c = [{ id: "a", created_at: "2026-01-01", last_activity_at: "2026-10-17" }, { id: "b", created_at: "2026-01-01", last_activity_at: "2026-10-17" }];
  const sources = [[{ customer_id: "a", product_id: "av-synthesis", started_at: "2026-10-10" }, { customer_id: "b", product_id: "av-sort", started_at: "2026-10-10" }]];
  const payments = [{ customer_id: "a", product_id: "av-sort", entry_type: "revenue" }];
  expect(overviewUsers(c, sources, payments, new Set(["av-synthesis"]), false, "2026-10-01")).toEqual({ unique: 1, paying: 0, free: 1, active: 1 });
  expect(overviewUsers(c, sources, payments, new Set(["av-sort", "av-synthesis"]), true, "2026-10-01")).toEqual({ unique: 2, paying: 1, free: 1, active: 2 });
});
test("customer lifecycle uses recorded memberships, never missing data as deletion", () => {
  const m = [{ customer_id: "a", product_id: "av-sort", status: "archived", started_at: "2026-01-01" }, { customer_id: "a", product_id: "av-synthesis", status: "active", started_at: "2026-03-01" }];
  expect(customerLifecycle("a", m, new Set(["av-sort"]))).toBe("archived");
  expect(customerLifecycle("a", m, new Set(["av-sort", "av-synthesis"]))).toBe("active");
  expect(customerLifecycle("b", m, new Set(["av-sort"]))).toBe("unknown");
});
test("joined date is company registration or selected product membership date", () => {
  const c = { id: "a", created_at: "2026-01-01" };
  const m = [{ customer_id: "a", product_id: "av-sort", status: "active", started_at: "2026-03-01" }];
  expect(customerJoinedAt(c, m, new Set(["av-sort"]), false)).toBe("2026-03-01");
  expect(customerJoinedAt(c, m, new Set(["av-sort"]), true)).toBe("2026-01-01");
  expect(customerJoinedAt(c, m, new Set(["av-synthesis"]), false)).toBe(null);
});
test("credit axis increments by exactly 100", () => {
  expect(creditTicks(250)).toEqual([0, 100, 200, 300]);
  expect(creditTicks(0)).toEqual([0, 100]);
});
test("day chart sums credits per hour and excludes the next day", () => {
  const rows = [{ customer_id: "a", product_id: "av-sort", created_at: "2026-10-17T01:00:00Z", billing_units: 125 }, { customer_id: "a", product_id: "av-sort", created_at: "2026-10-17T01:30:00Z", billing_units: 25 }, { customer_id: "a", product_id: "av-sort", created_at: "2026-10-18T00:00:00Z", billing_units: 500 }];
  const s = usageSeries(rows, "2026-10-17", "day");
  expect(s.length).toBe(24); expect(s[1].credits).toBe(150); expect(s.reduce((n, r) => n + r.credits, 0)).toBe(150);
});
test("month date window has one daily bucket including empty days", () => {
  expect(usageSeries([], "2026-10-17", "month").length).toBe(31);
});
test("6mo date window contains six monthly buckets across year boundaries", () => {
  const s = usageSeries([], "2026-10-17", "6mo");
  expect(s.length).toBe(6); expect(s[5].date).toBe("2027-03-01T00:00:00.000Z");
});
test("yearly date window contains twelve monthly buckets", () => {
  const s = usageSeries([], "2026-10-17", "year");
  expect(s.length).toBe(12); expect(s[0].date).toBe("2026-01-01T00:00:00.000Z");
});

test("chart totals input and output tokens in the same date bucket as credits", () => {
  const rows = [
    { customer_id: "a", product_id: "av-synthesis", created_at: "2026-10-17T01:00:00Z", billing_units: 100, input_tokens: 2000, output_tokens: 500 },
    { customer_id: "a", product_id: "av-synthesis", created_at: "2026-10-17T02:00:00Z", billing_units: 25, input_tokens: 1000, output_tokens: null },
    { customer_id: "a", product_id: "av-synthesis", created_at: "2026-11-01T00:00:00Z", billing_units: 50, input_tokens: 9000, output_tokens: 1000 },
  ];
  const s = usageSeries(rows, "2026-10-17", "month");
  expect(s[16]).toEqual({ date: "2026-10-17T00:00:00.000Z", credits: 125, tokens: 3500 });
  expect(s[15].tokens).toBe(0);
  expect(s.reduce((sum, r) => sum + r.tokens, 0)).toBe(3500);
});

test("Week contains Monday through Sunday around the selected date", () => {
  const s = usageSeries([], "2026-10-17", "week");
  expect(s.length).toBe(7);
  expect(s[0].date).toBe("2026-10-12T00:00:00.000Z");
  expect(s[6].date).toBe("2026-10-18T00:00:00.000Z");
});
test("30 Days includes the selected ending date and exactly 29 preceding days", () => {
  const rows = [{ customer_id: "a", product_id: "av-sort", created_at: "2026-09-18T01:00:00Z", billing_units: 100 }, { customer_id: "a", product_id: "av-sort", created_at: "2026-10-17T23:59:00Z", billing_units: 25 }, { customer_id: "a", product_id: "av-sort", created_at: "2026-09-17T23:59:00Z", billing_units: 900 }];
  const s = usageSeries(rows, "2026-10-17", "30days");
  expect(s.length).toBe(30);
  expect(s[0].credits).toBe(100);
  expect(s[29].credits).toBe(25);
  expect(s.reduce((sum, r) => sum + r.credits, 0)).toBe(125);
});
test("All Time combines all users across all recorded dates, independent of the anchor", () => {
  const rows = [{ customer_id: "a", product_id: "av-sort", created_at: "2024-01-01T01:00:00Z", billing_units: 100, input_tokens: 500 }, { customer_id: "b", product_id: "av-sort", created_at: "2026-10-17T23:59:00Z", billing_units: 25, output_tokens: 1000 }];
  const s = usageSeries(rows, "2020-01-01", "all");
  expect(s[0].date).toBe("2024-01-01T00:00:00.000Z");
  expect(s[s.length - 1].date).toBe("2026-10-01T00:00:00.000Z");
  expect(s.reduce((sum, r) => sum + r.credits, 0)).toBe(125);
  expect(s.reduce((sum, r) => sum + r.tokens, 0)).toBe(1500);
  expect(usageSeries(rows.filter(r => r.customer_id === "a"), "2020-01-01", "all")[0].credits).toBe(100);
});
