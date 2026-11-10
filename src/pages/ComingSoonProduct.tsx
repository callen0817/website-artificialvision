import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { mailtoInquiry, type SuiteProduct } from "@/data/site";

const ComingSoonProduct = ({ product }: { product: SuiteProduct }) => (
  <div className="min-h-screen bg-background text-foreground">
    <SiteNav />
    <main className="mx-auto max-w-[1400px] px-6 pt-32 pb-24 lg:px-10">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="label-mono text-gold">{product.status}</p>
          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] tracking-[-0.03em] sm:text-6xl">{product.name}</h1>
          <p className="mt-3 text-lg text-titanium">{product.tagline}</p>
          <p className="mt-7 text-muted-foreground leading-relaxed sm:text-lg">{product.description}</p>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {product.features.map(f => <li key={f} className="flex gap-3 py-3.5 text-sm text-foreground/80"><span className="mt-2.5 h-px w-4 shrink-0 bg-gold" />{f}</li>)}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href={mailtoInquiry(`Inquiry: ${product.name}`, `I'd like to hear when ${product.name} is available.`)}><Mail /> Get release updates</a></Button>
            <Button asChild size="lg" variant="outline"><Link to="/av-suite">AV Suite <ArrowRight /></Link></Button>
          </div>
        </div>
        <div className="flex h-[420px] items-center justify-center border border-border bg-surface p-12">
          <img src={product.logo} alt={`${product.name} logo`} className="h-full w-full object-contain" />
        </div>
      </div>
    </main>
    <SiteFooter />
  </div>
);

export default ComingSoonProduct;
