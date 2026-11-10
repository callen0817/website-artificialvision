import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowRight, Download, Mail } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import Reveal from "@/components/site/Reveal";
import { suiteProducts, mailtoInquiry } from "@/data/site";
import { Button } from "@/components/ui/button";
import { avToolsProduct, revitPlugins, type RevitPlugin } from "@/data/avTools";
import { avSortProduct, avShiftProduct } from "@/data/avSortShift";
import ToolDownloadDialog from "@/components/site/ToolDownloadDialog";
import { avHeroProduct } from "@/data/avHero";
import NotFound from "@/pages/NotFound";
import { avShutterProduct } from "@/data/avShutter";
import ShutterImageSlider from "@/components/site/ShutterImageSlider";

const products = [...suiteProducts, avSortProduct, avShiftProduct, avToolsProduct, avHeroProduct, avShutterProduct];

const AVSuite = () => {
  const [downloadPlugin, setDownloadPlugin] = React.useState<RevitPlugin | null>(null);
  const location = useLocation();
  const { productId } = useParams<{ productId: string }>();

  React.useEffect(() => {
    const id = location.hash.slice(1) || productId;
    if (!id) return;
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [location.hash, productId, location.key]);

  if (productId && !products.some(product => product.id === productId)) return <NotFound />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="absolute inset-0 grid-lines opacity-60 pointer-events-none" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="max-w-3xl animate-fade-up">
            <p className="label-mono text-gold">AV Suite</p>
            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              AV Suite. Connected software
              <br />
              for the built environment.
            </h1>
            <p className="mt-7 text-muted-foreground leading-relaxed sm:text-lg">
              AV Synthesis is Artificial Vision's primary commercial software product and first major
               commercial release. AV Scan brings universal spatial capture to the ecosystem. Our developing spatial applications carry raw capture
              through structuring, alignment, classification, reconstruction, and delivery.
            </p>
          </div>

          <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <Button
                variant="ghost"
                key={p.id}
                asChild
                className="group h-auto rounded-none bg-background p-6 text-left whitespace-normal items-start flex-col transition-colors hover:bg-surface hover:text-foreground"
              >
                <Link to={`/av-suite/${p.id}`}>
                <span className="label-mono text-muted-foreground/70 group-hover:text-gold transition-colors">
                  {p.stage}
                </span>
                <span className="mt-4 font-display text-base">{p.name}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {products.map((product, index) => {
        const flipped = index % 2 === 1;
        return (
          <section key={product.id} id={product.id} className="scroll-mt-16 border-t border-border py-24 lg:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
                <Reveal className={`border border-border bg-surface ${flipped ? "lg:order-2" : ""}`}>
                  {product.id === "av-shutter-360" ? <ShutterImageSlider /> : <img
                    src={product.image}
                    alt={`${product.name} — ${product.tagline}`}
                    loading="lazy"
                    className={product.id === "av-hero" ? "h-auto w-full object-contain" : `h-[420px] w-full ${["av-scan", "av-synthesis", "av-tools", "av-sort", "av-shift"].includes(product.id) ? "object-contain" : "object-cover"}`}
                  />}
                  {product.imageCaption && <p className="label-mono border-t border-border px-6 py-4 text-muted-foreground">{product.imageCaption}</p>}
                </Reveal>

                <Reveal delay={100} className={flipped ? "lg:order-1" : ""}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center border border-border bg-surface">
                      <img src={product.logo} alt="" aria-hidden className={`h-6 w-6 object-contain ${["av-hero", "av-shutter-360"].includes(product.id) ? "invert" : ""}`} />
                    </div>
                    <span className="label-mono text-gold">{product.stage}</span>
                  </div>

                  <h2 className="mt-7 font-display text-3xl tracking-[-0.02em] sm:text-[2.5rem]">{product.name}</h2>
                  <p className="mt-2 text-lg text-titanium">{product.tagline}</p>
                  <p className="mt-3 label-mono text-gold">{product.status}</p>

                  <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

                  <ul className="mt-8 divide-y divide-border border-y border-border">
                    {product.features.map((f) => (
                      <li key={f} className="flex gap-3 py-3.5 text-sm text-foreground/80">
                        <span className="mt-2.5 h-px w-4 shrink-0 bg-gold" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {product.outputs.map((o) => (
                      <span key={o} className="label-mono border border-border px-3 py-1.5 text-muted-foreground">
                        {o}
                      </span>
                    ))}
                  </div>

                  {product.id === "av-tools" ? <>
                    <p className="mt-7 text-sm text-muted-foreground leading-relaxed">Nested families can make an object easier to scale—for example, a planter family nested inside a second family, then a third. Once the size is right, NF Xplode removes the nested structure so the simplified family keeps that scale.</p>
                    <div className="mt-8 grid border border-border bg-background grid-cols-2 sm:grid-cols-3" aria-label="Revit plugin downloads">
                      {revitPlugins.map(plugin => {
                        const contents = <><span className="flex aspect-square w-full max-w-32 items-center justify-center bg-surface"><img src={plugin.icon} alt="" aria-hidden className="h-full w-full object-contain" /></span><span className="flex items-center justify-center gap-2 font-display text-base"><span>{plugin.name}</span><Download aria-hidden className="h-4 w-4 shrink-0" /></span></>;
                        const classes = "h-auto min-h-48 rounded-none border-r border-border bg-background p-3 sm:p-4 whitespace-normal flex-col gap-4 text-center hover:bg-surface hover:text-foreground disabled:opacity-100";
                        return plugin.downloadUrl ? <Button variant="ghost" key={plugin.id} className={classes} onClick={() => setDownloadPlugin(plugin)} aria-label={`Download ${plugin.name}`}>{contents}</Button> : <Button variant="ghost" key={plugin.id} disabled className={classes} aria-label={`Download ${plugin.name} — pending`}>{contents}</Button>;
                      })}
                    </div>
                  </> : product.href ? <Button asChild size="lg" className="mt-9"><Link to={product.href}>Explore {product.name} <ArrowRight /></Link></Button> : <Button asChild size="lg" className="mt-9"><a
                    href={mailtoInquiry(
                      `Inquiry: ${product.name}`,
                      `I'm interested in ${product.name}. Please send pricing, licensing, and technical details.`
                    )}
                  >
                    <Mail className="h-4 w-4" />
                    Inquire about {product.name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a></Button>}
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="flex flex-col items-start justify-between gap-8 border border-border bg-surface p-10 lg:flex-row lg:items-center lg:p-14">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl tracking-[-0.02em] sm:text-3xl">
                Discover the Artificial Vision ecosystem.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Explore AV Synthesis and AV Scan, or inquire about development and availability of our spatial software and scanAR hardware.
              </p>
            </div>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-gold hover:text-accent-foreground"
            >
              Contact us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {downloadPlugin?.downloadUrl && <ToolDownloadDialog open onOpenChange={o => !o && setDownloadPlugin(null)} toolId={downloadPlugin.id} toolName={downloadPlugin.name} downloadUrl={downloadPlugin.downloadUrl} />}
      <SiteFooter />
    </div>
  );
};

export default AVSuite;