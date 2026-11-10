import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import Reveal from "@/components/site/Reveal";
import showcaseBim from "@/assets/showcase-bim.jpg";

const principles = [
  { title: "Field first", body: "Every product is validated on live projects before it is productized. If it does not survive a jobsite, it does not ship." },
  { title: "Compatible by default", body: "Outputs target the formats and classifications teams already use — E57, ReCap, Revit, Navisworks — not a proprietary island." },
  { title: "Own your data", body: "Deliverables are self-hostable and offline-capable. Spatial records should outlive a subscription." },
  { title: "Engineering over marketing", body: "Claims are tied to measurable behaviour: field of view, positioning accuracy, registration error, throughput." },
];

const About = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SiteNav />

    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-20">
      <div className="absolute inset-0 grid-lines opacity-60 pointer-events-none" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-3xl animate-fade-up">
          <p className="label-mono text-gold">About</p>
          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            An engineering company
            <br />
            built out of the field
          </h1>
          <p className="mt-7 text-muted-foreground leading-relaxed sm:text-lg">
            Artificial Vision develops AI-powered spatial intelligence systems for the physical world.
            AV Synthesis is our primary commercial software product and first major commercial release.
            The company exists because the tools available to capture and interpret buildings could not
            keep up with the projects that needed them.
          </p>
        </div>
      </div>
    </section>

    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-start">
        <Reveal>
          <p className="label-mono text-gold">Mission</p>
          <h2 className="mt-5 font-display text-3xl leading-tight tracking-[-0.02em] sm:text-[2.4rem]">
            Make physical environments machine-readable — accurately, quickly, and without lock-in.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Reality capture produced enormous amounts of data and very little intelligence. Point clouds
            arrived unregistered, unclassified, and unusable without days of manual work. Artificial
            Vision closes that gap with hardware and software designed against each other: a capture
            platform that records pose, imagery, and range together, and a processing suite that turns
            those signals into structured, classified, deliverable spatial assets.
          </p>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            AV Synthesis brings construction document discovery, evidence, and connected responsibility
             earlier into project delivery. Pre-VDC prepares the preconstruction. AV Scan turns compatible sensing hardware into spatial-capture systems. The broader software and hardware
            ecosystem continues that mission across the built environment. Find your sense.
          </p>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            The long-term objective is a continuous loop between physical space and its digital
            counterpart — sensors and robotics capturing change, models interpreting it, and digital
            twins staying true to the buildings and infrastructure they represent.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <p className="label-mono text-gold">Founder</p>
          <h2 className="mt-5 font-display text-3xl leading-tight tracking-[-0.02em] sm:text-[2.4rem]">
            From construction sites to sensing systems
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Artificial Vision was founded by an engineer whose career began in construction, reality
            capture, and BIM coordination — scanning buildings, registering clouds, resolving clashes,
            and producing the documentation projects were built from. That work made the failure points
            obvious: projects without survey control, SLAM data that would not merge with drone
            photogrammetry, unstructured captures that could not be delivered as terrestrial-grade
            results, and virtual tours held hostage by rising hosting fees.
          </p>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Each product in the Artificial Vision stack answers one of those problems directly. AV Snap
            exists because alignment was manual and error-prone. AV Structure exists because SLAM output
            was not structured. AV Showcase exists because clients were paying indefinitely to view
            data they had already paid to capture. scanAR exists because the capture step itself was
            still slow, heavy, and tripod-bound.
          </p>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            The company operates the way it was formed: technical decisions made by people who have done
            the work in the field, and validated on real projects before they reach a customer.
          </p>
        </Reveal>
      </div>
    </section>

    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="label-mono text-gold">Principles</p>
          <h2 className="mt-5 font-display text-3xl tracking-[-0.02em] sm:text-[2.6rem]">How we build</h2>
        </Reveal>
        <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 70} className="bg-background p-8">
              <span className="label-mono text-gold">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 font-display text-lg tracking-tight">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120} className="mt-px border-x border-b border-border">
          <img src={showcaseBim} alt="Coordinated model produced from captured site data" loading="lazy" className="h-[380px] w-full object-cover" />
        </Reveal>
      </div>
    </section>

    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="flex flex-col items-start justify-between gap-8 border border-border bg-surface p-10 lg:flex-row lg:items-center lg:p-14">
          <h2 className="max-w-xl font-display text-2xl tracking-[-0.02em] sm:text-3xl">
            Partnerships, pilots, and investment conversations.
          </h2>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-gold hover:text-accent-foreground"
          >
            Get in touch
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>

    <SiteFooter />
  </div>
);

export default About;