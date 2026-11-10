import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Layers, Radar, Boxes, Building2, Factory, Route as RouteIcon, Warehouse } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import SynthesisActions from "@/components/site/SynthesisActions";
import { Button } from "@/components/ui/button";
import { philosophy, synthesisImage } from "@/data/synthesis";
import { synthesisCapabilities } from "@/data/synthesisCapabilities";
import Reveal from "@/components/site/Reveal";
import showcaseLidar from "@/assets/showcase-lidar.jpg";
import { suiteProducts } from "@/data/site";
import { avToolsProduct, revitPlugins } from "@/data/avTools";
import { avSortProduct, avShiftProduct } from "@/data/avSortShift";

const capabilities = [
  { icon: Radar, title: "Sensing", body: "Hemispherical LiDAR, global shutter imaging, dual-antenna RTK and IMU fusion captured while walking the site." },
  { icon: Cpu, title: "Understanding", body: "SLAM, registration, and AI classification turn raw trajectory and range data into structured, labeled geometry." },
  { icon: Layers, title: "Structuring", body: "Waypointed E57, ReCap-compatible classes, and fused photogrammetry — data that downstream tools already speak." },
  { icon: Boxes, title: "Delivering", body: "Digital twins, BIM-ready deliverables, splats and self-hosted walkthroughs handed to the teams who use them." },
];

const applications = [
  { icon: Building2, label: "Construction", body: "As-built verification, progress capture, and clash-ready models." },
  { icon: RouteIcon, label: "Infrastructure", body: "Corridor and asset documentation across indoor/outdoor transitions." },
  { icon: Warehouse, label: "Facilities", body: "Operational digital twins for maintenance, retrofit, and space planning." },
  { icon: Factory, label: "Industrial", body: "Plant and warehouse capture where tripods and downtime are not options." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main>
      <section className="relative overflow-hidden pt-28 pb-14 lg:pt-36 lg:pb-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="label-mono text-gold">Artificial Vision · First major commercial software release</p>
          <h1 className="mt-7 font-display text-5xl sm:text-7xl lg:text-8xl">AV Synthesis</h1>
          <p className="mt-7 font-display text-2xl sm:text-4xl leading-snug">VDC finds problems before construction.<br /><span className="text-gold">AV finds them before VDC.</span></p>
          <p className="mt-7 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">Turn construction drawings, specifications, schedules, requirements, issues, assumptions, and responsibilities into connected, evidence-backed Pre-VDC intelligence before downstream work depends on it.</p>
          <div className="mt-9"><SynthesisActions explore /></div>
          <div className="mt-12 pt-6 border-t border-border flex items-center gap-6"><img src={synthesisImage} alt="AV Synthesis product mark" className="synthesis-mark h-20 w-20 shrink-0" /><div><p className="text-sm text-foreground">Pre-VDC prepares the preconstruction.</p><p className="mt-2 text-sm text-muted-foreground">Verify. Direct. Clarify.</p></div></div>
        </div>
      </section>
      <section className="border-t border-border py-20 lg:py-24"><div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="max-w-3xl"><p className="label-mono text-gold">Earlier intelligence. Better prepared projects.</p><h2 className="mt-5 font-display text-3xl sm:text-4xl">Make the work before VDC visible.</h2><p className="mt-6 text-muted-foreground leading-relaxed">Construction teams already do Pre-VDC work manually: reading documents, cross-referencing information, finding discrepancies, documenting assumptions, identifying missing requirements, preparing questions, and assigning responsibility. AV Synthesis moves that discovery earlier, without replacing the people who know the work.</p></Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-3">{philosophy.map(item => <Reveal key={item.title} className="border-t border-border pt-7"><h3 className="font-display text-2xl uppercase">{item.title}</h3><p className="mt-3 text-lg text-gold">{item.subtitle}</p><p className="mt-4 text-sm text-muted-foreground leading-relaxed">{item.body}</p></Reveal>)}</div>
      </div></section>
      <section className="border-t border-border py-20 lg:py-24"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><Reveal><p className="label-mono text-gold">AV Synthesis · Evidence first</p><h2 className="mt-5 font-display text-3xl sm:text-4xl">Project information.<br />Connected, not scattered.</h2></Reveal><div className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">{synthesisCapabilities.filter((_, i) => [0, 1, 2, 3, 4, 5].includes(i)).map(item => <Reveal key={item.title} className="border-t border-border py-7"><h3 className="font-display text-xl">{item.title}</h3><p className="mt-4 text-sm text-muted-foreground leading-relaxed">{item.body}</p></Reveal>)}</div><p className="mt-5 text-sm text-muted-foreground">Trade Intelligence, revision intelligence, regulatory verification, Search AV, and reports retain the same evidence-first, human-review approach.</p><Button asChild variant="link" className="px-0 mt-6 text-gold"><Link to="/av-synthesis">See how AV Synthesis works <ArrowRight /></Link></Button></div></section>

      {/* WHAT WE BUILD */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <p className="label-mono text-gold">What we build</p>
            <h2 className="mt-5 font-display text-3xl leading-tight tracking-[-0.02em] sm:text-[2.6rem]">
              Artificial Vision. Find your sense.
            </h2>
            <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">
              Artificial Vision develops technology that helps people and computers better understand the built environment. AV Synthesis is our primary commercial software product; our broader work spans artificial intelligence, construction technology, computer vision, spatial intelligence, reality capture, digital construction, hardware, and software.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 80} className="bg-background p-8">
                <c.icon className="h-6 w-6 text-gold" strokeWidth={1.4} />
                <h3 className="mt-6 font-display text-lg tracking-tight">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="label-mono text-gold">Featured products</p>
            <h2 className="mt-5 font-display text-3xl leading-tight tracking-[-0.02em] sm:text-[2.6rem]">Start with these</h2>
          </Reveal>
          <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-3">
            {[
              { id: "av-synthesis", name: "AV Synthesis", logo: suiteProducts.find(p => p.id === "av-synthesis")?.logo, text: "Pre-VDC prepares the preconstruction. Verify, direct and clarify project requirements.", status: "Primary commercial product", to: "/av-synthesis" },
              { id: "av-sort", name: avSortProduct.name, logo: avSortProduct.logo, text: avSortProduct.description, status: avSortProduct.status, to: "/av-sort" },
              { id: "nf-xplode", name: revitPlugins[0].name, logo: revitPlugins[0].icon, text: "A free AV Tools Revit plugin that explodes nested families while keeping the scale you set.", status: "Free download", to: "/av-suite#av-tools" },
            ].map((p, i) => (
              <Reveal key={p.id} delay={i * 70} className="group bg-background">
                <Link to={p.to} className="flex h-full flex-col p-8 transition-colors hover:bg-surface">
                  <img src={p.logo} alt="" aria-hidden className="h-16 w-16 object-contain" />
                  <h3 className="mt-7 font-display text-xl tracking-tight">{p.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                  <p className="mt-4 label-mono text-gold">{p.status}</p>
                  <span className="mt-auto pt-8 inline-flex items-center gap-2 label-mono text-muted-foreground/60 group-hover:text-gold transition-colors">Explore {p.name} <ArrowRight className="h-3.5 w-3.5" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AV SUITE */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="label-mono text-gold">AV Suite</p>
              <h2 className="mt-5 font-display text-3xl leading-tight tracking-[-0.02em] sm:text-[2.6rem]">
                A broader software ecosystem
              </h2>
            </div>
            <Link to="/av-suite" className="group inline-flex items-center gap-2 text-sm font-medium text-gold">
              Explore AV Suite
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {[...suiteProducts, avSortProduct, avShiftProduct, avToolsProduct].map((p, i) => (
              <Reveal key={p.id} delay={i * 70} className="group bg-background">
                <Link to={p.href ?? `/av-suite#${p.id}`} className="flex h-full flex-col p-7 transition-colors hover:bg-surface">
                  <img src={p.logo} alt="" aria-hidden className="h-9 w-9 object-contain" />
                  <h3 className="mt-7 font-display text-lg tracking-tight">{p.name}</h3>
                   <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>{p.id === "av-scan" && <p className="mt-3 text-sm text-muted-foreground">Turn compatible LiDAR, depth, stereo and camera hardware into intelligent spatial-capture systems.</p>}<p className="mt-3 label-mono text-gold">{p.status}</p>
                  <span className="mt-auto pt-8 label-mono text-muted-foreground/60 group-hover:text-gold transition-colors">
                     {p.href ? `Explore ${p.name}` : p.stage}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="mt-7 text-sm text-muted-foreground">The broader ecosystem also includes scanAR hardware. <Link to="/contact" className="text-gold">Inquire about development and availability.</Link></p>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <Reveal>
              <p className="label-mono text-gold">Deployment</p>
              <h2 className="mt-5 font-display text-3xl leading-tight tracking-[-0.02em] sm:text-[2.6rem]">
                Built for real sites, not demos
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Every product in the Artificial Vision stack exists because a project needed it — control
                that was never set, SLAM data that would not merge with drone photogrammetry, tours locked
                behind recurring hosting fees.
              </p>
              <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2">
                {applications.map((a) => (
                  <div key={a.label} className="bg-background p-6">
                    <a.icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
                    <h3 className="mt-4 text-sm font-medium">{a.label}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={120} className="border border-border">
              <img
                src={showcaseLidar}
                alt="LiDAR capture of a built environment"
                loading="lazy"
                className="h-[460px] w-full object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="flex flex-col items-start justify-between gap-8 border border-border bg-surface p-10 lg:flex-row lg:items-center lg:p-14">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl leading-tight tracking-[-0.02em] sm:text-3xl">
                Prepare the project before downstream work begins.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Explore AV Synthesis, book a demonstration, or discuss the broader Artificial Vision ecosystem.
              </p>
            </div>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-gold hover:text-accent-foreground"
            >
              Contact Artificial Vision
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;