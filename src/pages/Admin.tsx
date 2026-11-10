import { Fragment, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import AiUsagePanel from "@/components/admin/AiUsagePanel";
import SiteNav from "@/components/site/SiteNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { scopeIds, downloadStats, financialSummary, customerProductIds, customerLifecycle, customerJoinedAt, overviewUsers, type Membership, type DatedAiRow, type Product, type DownloadEvent, type FinEntry } from "@/lib/adminMetrics";

type Row = Record<string, any>;
const money = (n: number | null, has = true) => (!has || n === null ? "Unknown" : n.toLocaleString(undefined, { style: "currency", currency: "USD" }));
const pct = (n: number | null) => (n === null ? "Unknown" : `${(n * 100).toFixed(1)}%`);

const exportCsv = (name: string, rows: Row[]) => {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [keys.join(","), ...rows.map(r => keys.map(k => esc(r[k])).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = `${name}.csv`; a.click();
};

const Stat = ({ label, value, note }: { label: string; value: string | number; note?: string }) => (
  <div className="bg-background p-5"><p className="label-mono text-muted-foreground">{label}</p><p className="mt-2 font-display text-2xl">{value}</p>{note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}</div>
);

const Mfa = ({ onDone }: { onDone: () => void }) => {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.mfa.listFactors().then(async ({ data }) => {
      const f = data?.totp?.find(f => f.status === "verified");
      if (f) { setFactorId(f.id); return; }
      const { data: en, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: `admin-${Date.now()}` });
      if (error) setMsg(error.message); else { setFactorId(en.id); setQr(en.totp.qr_code); }
    });
  }, []);
  const verify = async (e: React.FormEvent) => {
    e.preventDefault(); if (!factorId) return;
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: code.trim() });
    if (error) setMsg(error.message); else onDone();
  };
  return (
    <form onSubmit={verify} className="mt-6 max-w-sm space-y-4">
      <h1 className="font-display text-3xl">Two-step verification</h1>
      {qr ? <><p className="text-sm text-muted-foreground">Scan this code with an authenticator app (Google Authenticator, 1Password, Authy), then enter the 6-digit code.</p><img src={qr} alt="Authenticator setup code" className="h-48 w-48 bg-white" /></> : <p className="text-sm text-muted-foreground">Enter the 6-digit code from your authenticator app.</p>}
      <div className="space-y-2"><Label htmlFor="mfa">Code</Label><Input id="mfa" inputMode="numeric" required value={code} onChange={e => setCode(e.target.value)} /></div>
      {msg && <p className="text-sm text-destructive">{msg}</p>}
      <Button type="submit" className="w-full">Verify</Button>
    </form>
  );
};

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [aal2, setAal2] = useState(false);
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in"); const [msg, setMsg] = useState<string | null>(null);
  const [products, setProducts] = useState<Row[]>([]);
  const [customers, setCustomers] = useState<Row[]>([]);
  const [memberships, setMemberships] = useState<Row[]>([]);
  const [events, setEvents] = useState<Row[]>([]);
  const [fin, setFin] = useState<Row[]>([]);
  const [ai, setAi] = useState<Row[]>([]);
  const [filter, setFilter] = useState("all");
  const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [lifecycle, setLifecycle] = useState("all");
  const [selected, setSelected] = useState<Row | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  const checkAal = async () => {
    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    setAal2(data?.currentLevel === "aal2");
  };

  useEffect(() => {
    if (!session) { setIsAdmin(null); setAal2(false); return; }
    supabase.rpc("claim_admin").then(({ data }) => setIsAdmin(!!data));
    checkAal();
  }, [session]);

  const load = async () => {
    const [p, c, d, f, a, m] = await Promise.all([
      supabase.from("products").select("*").order("name"),
      supabase.from("customers").select("*").order("created_at", { ascending: false }),
      supabase.from("download_events").select("*").order("created_at", { ascending: false }),
      supabase.from("financial_entries").select("*").order("accrual_date", { ascending: false }),
      (async () => {
        const rows: Row[] = [];
        for (let offset = 0; ; offset += 1000) {
          const result = await supabase.from("runtime_ai_usage").select("*").order("created_at", { ascending: false }).order("id").range(offset, offset + 999);
          if (result.error) { setMsg(result.error.message); return { data: [] }; }
          rows.push(...(result.data ?? []));
          if ((result.data?.length ?? 0) < 1000) return { data: rows };
        }
      })(),
      supabase.from("product_memberships").select("*"),
    ]);
    setProducts(p.data ?? []); setCustomers(c.data ?? []); setEvents(d.data ?? []); setFin(f.data ?? []); setAi(a.data ?? []);
    setMemberships(m.data ?? []);
  };
  useEffect(() => { if (isAdmin && aal2) load(); }, [isAdmin, aal2]);

  const inRange = (d: string) => (!from || d >= from) && (!to || d.slice(0, 10) <= to);
  const ids = useMemo(() => scopeIds(products as Product[], filter), [products, filter]);
  const scopedEvents = events.filter(e => inRange(e.created_at)) as DownloadEvent[];
  const scopedFin = fin.filter(e => inRange(e.accrual_date)) as FinEntry[];
  const dl = downloadStats(scopedEvents, ids);
  const fs = financialSummary(scopedFin, filter === "all" ? null : ids);
  const associations = [memberships, events, fin, ai];
  const userStats = overviewUsers(customers as { id: string; created_at: string; last_activity_at: string | null }[], associations as Parameters<typeof overviewUsers>[1], fin as Parameters<typeof overviewUsers>[2], ids, filter === "all", new Date(Date.now() - 30 * 864e5).toISOString());
  const newRegs = customers.filter(c => {
    const joined = customerJoinedAt(c as { id: string; created_at: string }, memberships as Membership[], ids, filter === "all");
    return joined && inRange(joined);
  }).length;
  const scopeLabel = filter === "all" ? "Artificial Vision" : filter === "software" ? "Software" : filter === "hardware" ? "Hardware" : products.find(p => p.id === filter)?.name ?? filter;

  const auth = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null);
    if (mode === "in") { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) setMsg(error.message); }
    else { const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } }); setMsg(error ? error.message : "Check your email to confirm your account, then sign in."); }
  };

  const addEntry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;
    const f = new FormData(e.currentTarget);
    const row = {
      product_id: (f.get("product") as string) || null, entry_type: f.get("type") as string, subcategory: (f.get("sub") as string) || null,
      amount: Number(f.get("amount")), accrual_date: f.get("date") as string, cash_date: (f.get("cash") as string) || null,
      provider: (f.get("provider") as string) || null, verified: f.get("verified") === "on", source: (f.get("source") as string) || "manual", created_by: session.user.id,
    };
    const { error } = await supabase.from("financial_entries").insert(row);
    if (error) { setMsg(error.message); return; }
    await supabase.from("admin_audit_log").insert({ actor: session.user.id, action: "financial_entry.create", detail: row });
    e.currentTarget.reset(); load();
  };

  const productName = (id: string) => products.find(p => p.id === id)?.name ?? id;
  const inScopeFin = (e: Row) => filter === "all" || (e.product_id ? ids.has(e.product_id) : false);
  const scopedFinRows = fin.filter(e => inRange(e.accrual_date) && inScopeFin(e));
  const customerProducts = (customerId: string) => customerProductIds(customerId, [memberships, events, fin, ai] as { customer_id: string | null; product_id: string | null }[][], ids);
  const inScopeCustomer = (c: Row) =>
    filter === "all" || customerProducts(c.id).size > 0;
  const filteredCustomers = customers.filter(c => inScopeCustomer(c) && (lifecycle === "all" || customerLifecycle(c.id, memberships as Membership[], ids) === lifecycle) && [c.name, c.email, c.company].join(" ").toLowerCase().includes(search.toLowerCase()));
  const custRow = (c: Row): Row => {
    const ce = events.filter(e => e.customer_id === c.id && ids.has(e.product_id)), cf = fin.filter(e => e.customer_id === c.id && inScopeFin(e));
    const s = financialSummary(cf as FinEntry[], null);
    return { ...c, joined_at: customerJoinedAt(c as { id: string; created_at: string }, memberships as Membership[], ids, filter === "all"), lifecycle: customerLifecycle(c.id, memberships as Membership[], ids), company: c.company || "Not provided", products: [...customerProducts(c.id)].map(productName).join(", ") || "—", downloads: ce.length, payments: s.revenue, refunds: s.refunds, net: s.netRevenue, direct: s.direct, contribution: s.netRevenue - s.direct, hasFin: s.hasData };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-[1400px] px-6 pt-32 pb-20 lg:px-10">
        <p className="label-mono text-gold">Artificial Vision administration</p>
        {!session ? (
          <form onSubmit={auth} className="mt-6 max-w-sm space-y-4">
            <h1 className="font-display text-3xl">{mode === "in" ? "Sign in" : "Create admin account"}</h1>
            <div className="space-y-2"><Label htmlFor="ae">Email</Label><Input id="ae" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="ap">Password</Label><Input id="ap" type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} /></div>
            {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
            <Button type="submit" className="w-full">{mode === "in" ? "Sign in" : "Create account"}</Button>
            <button type="button" className="text-sm text-gold" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? "First time? Create the admin account" : "Have an account? Sign in"}</button>
          </form>
        ) : isAdmin === false ? (
          <div className="mt-6 space-y-4"><p>This account doesn't have admin access.</p><Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button></div>
        ) : isAdmin && !aal2 ? (
          <Mfa onDone={checkAal} />
        ) : !isAdmin ? <p className="mt-6 text-muted-foreground">Checking access…</p> : (
          <>
            <div className="mt-6 flex flex-wrap items-end gap-3">
              <div className="space-y-1"><Label>Products</Label>
                <select className="h-10 border border-input bg-background px-3 text-sm" value={filter} onChange={e => setFilter(e.target.value)}>
                  <option value="all">All Artificial Vision</option><option value="software">Software only</option><option value="hardware">Hardware only</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.parent_product_id ? `— ${p.name}` : p.name}</option>)}
                </select></div>
              <div className="space-y-1"><Label>From</Label><Input type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
              <div className="space-y-1"><Label>To</Label><Input type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
              <Button variant="ghost" className="ml-auto" onClick={() => supabase.auth.signOut()}>Sign out</Button>
            </div>
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="flex-wrap h-auto"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="products">Products</TabsTrigger><TabsTrigger value="customers">Customers ({customers.length})</TabsTrigger><TabsTrigger value="downloads">Downloads</TabsTrigger><TabsTrigger value="finance">Finance</TabsTrigger><TabsTrigger value="ai">AI usage</TabsTrigger></TabsList>

              <TabsContent value="overview" className="mt-6">
                <p className="mb-4 text-sm text-muted-foreground">Data completeness: {fs.hasData ? (fs.allVerified ? "all financial records verified" : "some financial records unverified") : "no financial records yet — financial figures are Unknown"}. Subscriptions and payments from AV Synthesis, AV Sort and AV Shift are not connected yet.</p>
                <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                  <Stat label={`${scopeLabel} unique users`} value={userStats.unique} /><Stat label={`${scopeLabel} paying users`} value={userStats.paying} /><Stat label={`${scopeLabel} free users`} value={userStats.free} /><Stat label={`${scopeLabel} active (30 days)`} value={userStats.active} />
                  <Stat label="New registrations" value={newRegs} note="in scope and date range" /><Stat label="Downloads" value={dl.downloads} /><Stat label="Unique downloaders" value={dl.uniqueDownloaders} /><Stat label="Subscriptions" value="Unknown" note="not connected" />
                  <Stat label="Monthly recurring revenue" value="Unknown" note="no billing connected" /><Stat label="Total revenue" value={money(fs.netRevenue, fs.hasData)} /><Stat label="Direct costs" value={money(fs.direct, fs.hasData)} /><Stat label="Gross profit" value={money(fs.gross, fs.hasData)} />
                  <Stat label="Gross margin" value={pct(fs.grossMargin)} /><Stat label="Operating expenses" value={money(fs.opex, fs.hasData)} /><Stat label="Operating profit" value={money(fs.operating, fs.hasData)} /><Stat label="Net profit" value="Unknown" note="needs complete accounting" />
                  <Stat label="Development investment" value={money(fs.dev, fs.hasData)} /><Stat label="Cumulative cash flow" value={money(fs.cumulativeCash, fs.hasData)} /><Stat label="ROI" value={pct(fs.roi)} /><Stat label="Break-even" value={fs.breakEven === null ? "Unknown" : fs.breakEven ? "Reached" : "Not yet"} />
                </div>
              </TabsContent>

              <TabsContent value="products" className="mt-6 border border-border">
                <Table><TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Pricing</TableHead><TableHead>Downloads</TableHead><TableHead>Revenue</TableHead><TableHead>Direct costs</TableHead><TableHead>Operating profit</TableHead><TableHead>ROI</TableHead></TableRow></TableHeader>
                  <TableBody>{products.map(p => { const s = scopeIds(products as Product[], p.id); const d = downloadStats(scopedEvents, s); const f = financialSummary(scopedFin, s); return (
                    <TableRow key={p.id}><TableCell>{p.parent_product_id ? `↳ ${p.name}` : p.name}</TableCell><TableCell>{p.classification}</TableCell><TableCell>{p.release_status}</TableCell><TableCell>{p.pricing_model}</TableCell><TableCell>{p.download_available || d.downloads ? d.downloads : "N/A"}</TableCell><TableCell>{money(f.netRevenue, f.hasData)}</TableCell><TableCell>{money(f.direct, f.hasData)}</TableCell><TableCell>{money(f.operating, f.hasData)}</TableCell><TableCell>{pct(f.roi)}</TableCell></TableRow>); })}</TableBody></Table>
              </TabsContent>

              <TabsContent value="customers" className="mt-6">
                <div className="mb-4 flex flex-wrap gap-2"><select aria-label="Customer status" className="h-10 border border-input bg-background px-3 text-sm" value={lifecycle} onChange={e => setLifecycle(e.target.value)}><option value="all">All statuses</option><option value="active">Active</option><option value="archived">Deleted / archived</option><option value="unknown">Unknown status</option></select><Input placeholder="Search name, email or company" value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" /><Button variant="outline" onClick={() => exportCsv("av-customers", filteredCustomers.map(custRow).map(({ hasFin, ...r }) => r))}>Export CSV</Button></div>
                <div className="border border-border"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Company</TableHead><TableHead>Products</TableHead><TableHead>Date joined</TableHead><TableHead>Status</TableHead><TableHead>Subscription</TableHead><TableHead>Payments</TableHead><TableHead>Refunds</TableHead><TableHead>Net revenue</TableHead><TableHead>Contribution</TableHead><TableHead>Last activity</TableHead></TableRow></TableHeader>
                  <TableBody>{filteredCustomers.length === 0 ? <TableRow><TableCell colSpan={12} className="text-muted-foreground">No customers yet.</TableCell></TableRow> : filteredCustomers.map(custRow).map(c => (
                    <Fragment key={c.id}>
                    <TableRow className="cursor-pointer" data-state={selected?.id === c.id ? "selected" : undefined} onClick={() => setSelected(selected?.id === c.id ? null : c)}><TableCell><Button variant="link" className="h-auto whitespace-normal p-0 text-left" aria-expanded={selected?.id === c.id} aria-controls={`customer-${c.id}-details`}>{c.name || c.email}</Button></TableCell><TableCell>{c.email}</TableCell><TableCell>{c.company}</TableCell><TableCell>{c.products}</TableCell><TableCell>{c.joined_at ? new Date(c.joined_at).toLocaleDateString() : "Unknown"}</TableCell><TableCell>{c.lifecycle === "archived" ? "Deleted / archived" : c.lifecycle === "active" ? "Active" : "Unknown"}</TableCell><TableCell>Unknown</TableCell><TableCell>{money(c.payments, c.hasFin)}</TableCell><TableCell>{money(c.refunds, c.hasFin)}</TableCell><TableCell>{money(c.net, c.hasFin)}</TableCell><TableCell>{money(c.contribution, c.hasFin)}</TableCell><TableCell>{c.last_activity_at ? new Date(c.last_activity_at).toLocaleDateString() : "—"}</TableCell></TableRow>
                {selected?.id === c.id && <TableRow><TableCell colSpan={12} className="bg-muted/30 p-0"><div id={`customer-${c.id}-details`} className="p-6"><div className="flex justify-between"><h2 className="font-display text-2xl">{selected.name}</h2><Button variant="ghost" onClick={() => setSelected(null)}>Close</Button></div>
                  <p className="text-sm text-muted-foreground">{selected.email} · {selected.company} · since {new Date(selected.created_at).toLocaleDateString()} · email {selected.email_verified ? "verified" : "not verified"}</p>
                  <p className="mt-2 text-sm">Products: {selected.products}</p>
                  <h3 className="mt-5 label-mono">Downloads</h3><ul className="mt-2 text-sm">{events.filter(e => e.customer_id === selected.id).map(e => <li key={e.id}>{productName(e.product_id)} — {new Date(e.created_at).toLocaleString()}</li>)}</ul>
                  <h3 className="mt-5 label-mono">Financial records</h3><ul className="mt-2 text-sm">{fin.filter(e => e.customer_id === selected.id).map(e => <li key={e.id}>{e.accrual_date} {e.entry_type} {money(Number(e.amount))} {e.verified ? "" : "(unverified)"}</li>)}{!fin.some(e => e.customer_id === selected.id) && <li className="text-muted-foreground">None recorded</li>}</ul></div></TableCell></TableRow>}
                    </Fragment>))}</TableBody></Table></div>

              </TabsContent>

              <TabsContent value="downloads" className="mt-6">
                <div className="mb-4 grid gap-px border border-border bg-border sm:grid-cols-3"><Stat label="Downloads" value={dl.downloads} /><Stat label="Unique downloaders" value={dl.uniqueDownloaders} /><Stat label="Repeat downloads" value={dl.repeatDownloads} /></div>
                <Button variant="outline" className="mb-4" onClick={() => exportCsv("av-downloads", scopedEvents.filter(e => ids.has(e.product_id)).map((e: Row) => ({ date: e.created_at, product: productName(e.product_id), name: e.name_at_download, company: e.company_at_download, email: customers.find(c => c.id === e.customer_id)?.email, version: e.version ?? "Unknown", status: e.status, source: e.source })))}>Export CSV</Button>
                <div className="border border-border"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Product</TableHead><TableHead>Name</TableHead><TableHead>Company</TableHead><TableHead>Email</TableHead><TableHead>Version</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>{scopedEvents.filter(e => ids.has(e.product_id)).map((e: Row) => <TableRow key={e.id}><TableCell>{new Date(e.created_at).toLocaleString()}</TableCell><TableCell>{productName(e.product_id)}</TableCell><TableCell>{e.name_at_download}</TableCell><TableCell>{e.company_at_download}</TableCell><TableCell>{customers.find(c => c.id === e.customer_id)?.email}</TableCell><TableCell>{e.version ?? "Unknown"}</TableCell><TableCell>{e.status}</TableCell></TableRow>)}</TableBody></Table></div>
              </TabsContent>

              <TabsContent value="finance" className="mt-6 space-y-6">
                <form onSubmit={addEntry} className="grid gap-3 border border-border p-5 sm:grid-cols-3 lg:grid-cols-5">
                  <select name="type" required className="h-10 border border-input bg-background px-3 text-sm"><option value="revenue">Revenue</option><option value="refund">Refund</option><option value="direct_cost">Direct cost</option><option value="hardware_cost">Hardware cost</option><option value="operating_expense">Operating expense</option><option value="development_investment">Development investment</option></select>
                  <select name="sub" className="h-10 border border-input bg-background px-3 text-sm"><option value="">Category…</option>{["Lovable development credits","Other coding-assistant credits","AI development inference","Testing AI","Third-party development","Human engineering","AI provider","Hosting","Storage","Software subscriptions","BOM/components","Prototype","Manufacturing","Assembly","Shipping/fulfillment","Inventory","Warranty/returns","Shared overhead"].map(s => <option key={s}>{s}</option>)}</select>
                  <select name="product" className="h-10 border border-input bg-background px-3 text-sm"><option value="">Company-wide</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                  <Input name="amount" type="number" step="0.01" required placeholder="Amount (USD)" />
                  <Input name="date" type="date" required title="Accrual date" />
                  <Input name="cash" type="date" title="Cash date" />
                  <Input name="provider" placeholder="Provider / vendor" />
                  <Input name="source" placeholder="Source (invoice #, export)" />
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="verified" /> Verified record</label>
                  <Button type="submit">Add entry</Button>
                </form>
                {msg && <p className="text-sm text-destructive">{msg}</p>}
                <Button variant="outline" onClick={() => exportCsv("av-financial-entries", scopedFinRows)}>Export CSV</Button>
                <div className="border border-border"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Category</TableHead><TableHead>Product</TableHead><TableHead>Amount</TableHead><TableHead>Verified</TableHead></TableRow></TableHeader>
                  <TableBody>{scopedFinRows.length === 0 ? <TableRow><TableCell colSpan={6} className="text-muted-foreground">No financial records in this scope.</TableCell></TableRow> : scopedFinRows.map(e => <TableRow key={e.id}><TableCell>{e.accrual_date}</TableCell><TableCell>{e.entry_type}</TableCell><TableCell>{e.subcategory}</TableCell><TableCell>{e.product_id ? productName(e.product_id) : "Company-wide"}</TableCell><TableCell>{money(Number(e.amount))}</TableCell><TableCell>{e.verified ? "Verified" : "Unverified"}</TableCell></TableRow>)}</TableBody></Table></div>
              </TabsContent>

              <TabsContent value="ai" className="mt-6">
                <AiUsagePanel key={filter} scopeLabel={scopeLabel} rows={ai.filter(r => ids.has(r.product_id)) as DatedAiRow[]} customers={customers as { id: string; name: string | null; email: string }[]} productName={productName} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
