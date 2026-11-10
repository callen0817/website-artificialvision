import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Add only approved, real editorial entries; external social entries retain their original URL.
export const insights: { title: string; category: string; date: string; href: string }[] = [];
export default function Insights() {
  return <div className="min-h-screen bg-background text-foreground"><SiteNav /><main className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-36 pb-28"><p className="label-mono text-gold">Artificial Vision</p><h1 className="mt-6 font-display text-4xl sm:text-6xl">Resources &amp; Insights</h1><p className="mt-6 max-w-2xl text-muted-foreground">Product releases, field perspectives, and the work behind Artificial Vision.</p><div className="mt-16 border-y border-border py-10">{insights.length ? insights.map(entry => <article key={entry.href} className="py-6"><p className="label-mono text-gold">{entry.category} · {entry.date}</p><h2 className="font-display text-2xl mt-3"><a href={entry.href}>{entry.title}</a></h2></article>) : <><h2 className="font-display text-2xl">No publications yet.</h2><p className="mt-3 text-muted-foreground">Explore our first major commercial software release.</p><Button asChild variant="link" className="px-0 mt-4"><Link to="/av-synthesis">Explore AV Synthesis →</Link></Button></>}</div></main><SiteFooter /></div>;
}