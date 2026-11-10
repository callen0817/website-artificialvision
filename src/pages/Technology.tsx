import { Link } from "react-router-dom";
import { ArrowRight, Radar, Camera, Layers3, Compass, Bot, Brain, Eye, Workflow, Building2, Route as RouteIcon, Warehouse, Factory } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import Reveal from "@/components/site/Reveal";
import showcaseLidar from "@/assets/showcase-lidar.jpg";
import showcaseBim from "@/assets/showcase-bim.jpg";
import showcaseDrone from "@/assets/showcase-drone.jpg";

const sensors = [
  { icon: Radar, title: "LiDAR", body: "Hemispherical time-of-flight ranging with a 180° field of view, tuned for continuous capture while in motion rather than static tripod occupation." },
  { icon: Camera, title: "RGB imaging", body: "Global shutter cameras at 4K eliminate rolling-shutter distortion at walking speed and supply colorization and photogrammetric texture." },
  { icon: Layers3, title: "Depth & range fusion", body: "Range returns are fused with imagery per frame, keeping geometry and appearance registered to the same pose at capture time." },
  { icon: Compass, title: "IMU & RTK", body: "Inertial measurement and dual-antenna RTK constrain the trajectory, delivering centimetre positioning outdoors and drift-corrected continuity indoors." },
  { icon: Bot, title: "Robotics", body: "The same sensing stack drives autonomous and human-guided platforms, generating real-time spatial data for navigation, path planning, and robot training." },
];

const intelligence = [
  { icon: Brain, title: "Artificial intelligence", body: "Learned models classify point cloud elements — walls, windows, doors, floors, ceilings, roofs — and map them onto Autodesk ReCap classifications so results are immediately usable." },
  { icon: Eye, title: "Computer vision", body: "Feature extraction, pose estimation, and panorama fusion connect imagery to geometry, producing RealView spheres and virtual waypoints from unstructured SLAM captures." },
  { icon: Workflow, title: "Machine learning", body: "Registration models align clouds and models to each other without survey control, replacing manual target placement and the error it introduces." },
  { icon: Layers3, title: "Automation", body: "Batch pipelines carry a dataset from raw capture through structuring, alignment, classification, and delivery with minimal operator intervention." },
];

const applications = [
  { icon: Building2, title: "Construction", body: "As-built verification, progress documentation, and coordination-ready models produced on the same day as the walk." },
  { icon: RouteIcon, title: "Architecture", body: "Existing-condition capture for renovation and adaptive reuse, delivered directly into BIM authoring environments." },
  { icon: Factory, title: "Infrastructure", body: "Corridor, bridge, and utility documentation where LiDAR and drone photogrammetry must be merged into one structured dataset." },
  { icon: Warehouse, title: "Facilities", body: "Operational digital twins and self-hosted walkthroughs for maintenance, space planning, and asset management." },
];

const stack = [
  ["Capture", "scanAR — hemispherical LiDAR, global shutter RGB, IMU, dual RTK"],
  ["Structure", "AV Structure — waypointed E57 with embedded RealView spheres"],
  ["Align", "AV Snap — control-free registration across clouds and models"],
  ["Classify", "AV Segment — ReCap-compatible semantic classification"],
  ["Reconstruct", "AV Splat — Gaussian splat reconstruction from point clouds"],
  ["Deliver", "AV Showcase — offline, embeddable digital twin environments"],
];

const Technology = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SiteNav />

    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-20">
      <div className="absolute inset-0 grid-lines opacity-60 pointer-events-none" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-3xl animate-fade-up">
          <p className="label-mono text-gold">Technology</p>
          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            Sensing, intelligence,
            <br />
            and deployment
          </h1>
          <p className="mt-7 text-muted-foreground leading-relaxed sm:text-lg">
            Artificial Vision engineers the full path from photons to decisions: the sensors that measure
            a space, the models that interpret it, and the pipelines that hand structured results to the
            people responsible for the building.
          </p>
        </div>
      </div>
    </section>

    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="label-mono text-gold">01 — Sensors</p>
          <h2 className="mt-5 font-display text-3xl tracking-[-0.02em] sm:text-[2.6rem]">Measuring the physical world</h2>
        </Reveal>
        <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {sensors.map((s, i) => (
            <Reveal key={s.title} delay={i * 70} className="bg-background p-8">
              <s.icon className="h-6 w-6 text-gold" strokeWidth={1.4} />
              <h3 className="mt-6 font-display text-lg tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Reveal>
          ))}
          <Reveal delay={350} className="bg-background">
            <img src={showcaseLidar} alt="LiDAR point cloud of a built environment" loading="lazy" className="h-full min-h-[220px] w-full object-cover" />
          </Reveal>
        </div>
      </div>
    </section>

    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="label-mono text-gold">02 — Intelligence</p>
          <h2 className="mt-5 font-display text-3xl tracking-[-0.02em] sm:text-[2.6rem]">Turning measurement into meaning</h2>
        </Reveal>
        <div className="mt-14 grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
            {intelligence.map((it, i) => (
              <Reveal key={it.title} delay={i * 80} className="bg-background p-8">
                <it.icon className="h-6 w-6 text-gold" strokeWidth={1.4} />
                <h3 className="mt-6 font-display text-lg tracking-tight">{it.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120} className="border border-border">
            <img src={showcaseBim} alt="Coordinated BIM model derived from scan data" loading="lazy" className="h-[460px] w-full object-cover" />
          </Reveal>
        </div>
      </div>
    </section>

    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="label-mono text-gold">03 — The stack</p>
          <h2 className="mt-5 font-display text-3xl tracking-[-0.02em] sm:text-[2.6rem]">End to end, without translation loss</h2>
        </Reveal>
        <div className="mt-14 border-t border-border">
          {stack.map(([stage, detail], i) => (
            <Reveal key={stage} delay={i * 50} className="grid gap-2 border-b border-border py-6 sm:grid-cols-[200px_1fr] sm:gap-8">
              <span className="label-mono text-gold">{stage}</span>
              <span className="text-sm text-foreground/80">{detail}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="label-mono text-gold">04 — Applications</p>
          <h2 className="mt-5 font-display text-3xl tracking-[-0.02em] sm:text-[2.6rem]">Where it is deployed</h2>
        </Reveal>
        <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {applications.map((a, i) => (
            <Reveal key={a.title} delay={i * 70} className="bg-background p-8">
              <a.icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
              <h3 className="mt-5 font-display text-lg tracking-tight">{a.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120} className="mt-px border-x border-b border-border">
          <img src={showcaseDrone} alt="Aerial capture merged with terrestrial scan data" loading="lazy" className="h-[360px] w-full object-cover" />
        </Reveal>
      </div>
    </section>

    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="flex flex-col items-start justify-between gap-8 border border-border bg-surface p-10 lg:flex-row lg:items-center lg:p-14">
          <h2 className="max-w-xl font-display text-2xl tracking-[-0.02em] sm:text-3xl">
            Request a technical briefing on the sensing and processing stack.
          </h2>
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

    <SiteFooter />
  </div>
);

export default Technology;