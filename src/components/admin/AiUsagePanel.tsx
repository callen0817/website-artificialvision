import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { aiUsageByUser, creditTicks, usageSeries, usageWindow, type DatedAiRow, type UsagePeriod } from "@/lib/adminMetrics";

type Props = { rows: DatedAiRow[]; customers: { id: string; name: string | null; email: string }[]; productName: (id: string) => string; scopeLabel: string };
export default function AiUsagePanel({ rows, customers, productName, scopeLabel }: Props) {
  const [user, setUser] = useState<string | null | undefined>(undefined);
  const [period, setPeriod] = useState<UsagePeriod>("month");
  const [anchor, setAnchor] = useState(new Date().toISOString().slice(0, 10));
  const [view, setView] = useState("chart");
  const userName = (id: string | null) => {
    const c = customers.find(c => c.id === id);
    return c ? c.name || c.email : "Unattributed";
  };
  const userRows = rows.filter(r => user === undefined || r.customer_id === user);
  const series = usageSeries(userRows, anchor, period);
  const ticks = creditTicks(Math.max(...series.map(p => p.credits), 0));
  const { start, end } = usageWindow(anchor, period, userRows);
  const itemized = userRows.filter(r => new Date(r.created_at) >= start && new Date(r.created_at) < end);
  const formatDate = (value: string) => new Date(value).toLocaleString(undefined, period === "day" ? { hour: "numeric", timeZone: "UTC" } : ["month", "week", "30days"].includes(period) ? { month: "short", day: "numeric", timeZone: "UTC" } : { month: "short", year: "numeric", timeZone: "UTC" });
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3"><Button variant={user === undefined ? "default" : "outline"} aria-pressed={user === undefined} onClick={() => { setUser(undefined); setView("chart"); }}>All</Button><h2 className="font-display text-2xl">{user === undefined ? `${scopeLabel} · All users` : userName(user)}</h2></div>
      <div className="text-sm text-muted-foreground">{series.reduce((sum, p) => sum + p.credits, 0).toLocaleString()} credits · {series.reduce((sum, p) => sum + p.tokens, 0).toLocaleString()} tokens · UTC</div>
    </div>
    <div className="flex flex-wrap items-end gap-4">
      <Tabs value={period} onValueChange={v => setPeriod(v as UsagePeriod)}><TabsList className="h-auto flex-wrap" aria-label="Usage period"><TabsTrigger value="day">Day</TabsTrigger><TabsTrigger value="week">Week</TabsTrigger><TabsTrigger value="month">Month</TabsTrigger><TabsTrigger value="30days">30 Days</TabsTrigger><TabsTrigger value="6mo">6mo</TabsTrigger><TabsTrigger value="year">Yearly</TabsTrigger><TabsTrigger value="all">All Time</TabsTrigger></TabsList></Tabs>
      {period !== "all" && <div className="space-y-1"><Label htmlFor="usage-date">{period === "6mo" ? "Starting date" : period === "30days" ? "Ending date" : "Date"}</Label><Input id="usage-date" type="date" value={anchor} onChange={e => { if (e.target.value) setAnchor(e.target.value); }} /></div>}
    </div>
    <Tabs value={view} onValueChange={setView}>
      <TabsList><TabsTrigger value="chart">Chart</TabsTrigger><TabsTrigger value="itemized">Itemized</TabsTrigger></TabsList>
      <TabsContent value="chart" className="mt-5">
        <div className="mb-3 flex justify-between text-sm text-muted-foreground"><span>Credits</span><span>Tokens (input + output)</span></div>
        <ChartContainer config={{ credits: { label: "Credits", color: "hsl(var(--gold-deep))" }, tokens: { label: "Tokens", color: "hsl(var(--titanium))" } }} className="h-[360px] w-full aspect-auto" aria-label="Credits and tokens used by date">
          <LineChart data={series} margin={{ top: 12, right: 18, bottom: 12, left: 8 }} accessibilityLayer>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tickFormatter={formatDate} minTickGap={35} />
            <YAxis yAxisId="credits" domain={[0, ticks[ticks.length - 1]]} ticks={ticks} interval={0} width={64} />
            <YAxis yAxisId="tokens" orientation="right" domain={[0, "auto"]} allowDecimals={false} width={64} tickFormatter={value => Number(value).toLocaleString(undefined, { notation: "compact" })} />
            <ChartTooltip content={<ChartTooltipContent labelFormatter={(_, payload) => formatDate(String(payload[0]?.payload.date ?? anchor))} />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line yAxisId="credits" type="linear" dataKey="credits" stroke="var(--color-credits)" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="tokens" type="linear" dataKey="tokens" stroke="var(--color-tokens)" strokeWidth={2} strokeDasharray="5 3" dot={false} isAnimationActive={false} />
          </LineChart>
        </ChartContainer>
        {!itemized.length && <p className="mt-3 text-sm text-muted-foreground">No usage recorded for this date window.</p>}
      </TabsContent>
      <TabsContent value="itemized" className="mt-5 border border-border"><Table><TableHeader><TableRow><TableHead>Date (UTC)</TableHead><TableHead>User</TableHead><TableHead>Product</TableHead><TableHead>Operation</TableHead><TableHead>Model</TableHead><TableHead>Tokens in/out</TableHead><TableHead>Credits</TableHead><TableHead>Provider cost</TableHead></TableRow></TableHeader><TableBody>
        {!itemized.length ? <TableRow><TableCell colSpan={8} className="text-muted-foreground">No usage recorded for this date window.</TableCell></TableRow> : itemized.map((r, i) => <TableRow key={r.id ?? i}><TableCell>{new Date(r.created_at).toLocaleString(undefined, { timeZone: "UTC" })}</TableCell><TableCell>{userName(r.customer_id)}</TableCell><TableCell>{productName(r.product_id)}</TableCell><TableCell>{r.operation ?? "—"}</TableCell><TableCell>{r.model ?? "—"}</TableCell><TableCell>{r.input_tokens ?? "—"}/{r.output_tokens ?? "—"}</TableCell><TableCell>{r.billing_units ?? "Unknown"}</TableCell><TableCell>{r.provider_cost ?? "Unknown"}</TableCell></TableRow>)}
      </TableBody></Table></TabsContent>
    </Tabs>
    <div className="border border-border"><p className="label-mono px-4 pt-4 text-gold">Usage by user</p><Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Products</TableHead><TableHead>Requests</TableHead><TableHead>Credits used</TableHead><TableHead>Provider cost</TableHead></TableRow></TableHeader><TableBody>
      {aiUsageByUser(rows).map(u => <TableRow key={u.customer_id ?? "none"} data-state={user === u.customer_id ? "selected" : undefined}><TableCell><Button variant="link" className="h-auto whitespace-normal p-0 text-left" onClick={() => { setUser(u.customer_id); setView("chart"); }}>{userName(u.customer_id)}</Button></TableCell><TableCell>{u.products.map(productName).join(", ")}</TableCell><TableCell>{u.requests}</TableCell><TableCell>{u.credits.toLocaleString()}</TableCell><TableCell>{u.costKnown ? u.cost.toFixed(4) : "Unknown"}</TableCell></TableRow>)}
      {!rows.length && <TableRow><TableCell colSpan={5} className="text-muted-foreground">No AI usage reported yet.</TableCell></TableRow>}
    </TableBody></Table></div>
  </div>;
}