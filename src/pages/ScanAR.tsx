import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Play, Check, X, Scan, Satellite, Camera, Glasses,
  Building2, Home, Trees, Factory, Palette, Bot, Boxes, GraduationCap, Star,
} from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import Reveal from "@/components/site/Reveal";
import scanarProduct from "@/assets/scanar-product-transparent.png";
import scanarGuiAsset from "@/assets/scanar-gui.jpg.asset.json";
import scanarBackpackAsset from "@/assets/ScanAR_Backpack_white.png.asset.json";
import scanarDroneAsset from "@/assets/ScanAR_Drone_white.png.asset.json";
import scanarHardhatAsset from "@/assets/ScanAR_Hardhat_white.png.asset.json";
import showcaseDrone from "@/assets/showcase-drone.jpg";

// The CDN route is served by Lovable hosting, not the local Vite server.
const photoUrl = (asset: { project_id: string; url: string }) =>
  import.meta.env.DEV && typeof window !== "undefined" && window.location.hostname === "localhost"
    ? `https://id-preview--${asset.project_id}.lovable.app${asset.url}`
    : asset.url;

const scanarBackpack = photoUrl(scanarBackpackAsset);
const scanarDrone = photoUrl(scanarDroneAsset);
const scanarHelmetKit = photoUrl(scanarHardhatAsset);
const scanarGui = photoUrl(scanarGuiAsset);

const capturePillars = [
  {
    title: "Capture",
    label: "Sensors",
    items: [
      "Hemispherical LiDAR with a 180° field of view — no blind spots in a single pass",
      "Global shutter cameras for zero motion blur at walking speed",
      "Dual-antenna RTK for centimetre positioning outdoors",
      "IMU-fused trajectory for continuous indoor operation",
    ],
  },
  {
    title: "Understand",
    label: "Onboard intelligence",
    items: [
      "Real-time SLAM — no post-capture alignment step",
      "Live coverage and drift feedback through the AR interface",
      "Seamless indoor/outdoor positioning handoff",
      "4K colorization fused to range data during capture",
    ],
  },
  {
    title: "Deliver",
    label: "Outputs",
    items: [
      "Registered point clouds ready for AV Suite processing",
      "Structured E57 with RealView spheres via AV Structure",
      "BIM and CAD workflows, clash detection, as-built verification",
      "Digital twins and virtual walkthroughs for operations",
    ],
  },
];

const features = [
  { icon: Scan, title: "Hemispherical LiDAR", body: "Industry-first 180° field of view captures everything around you in a single pass. No blind spots, no missed details." },
  { icon: Satellite, title: "Dual RTK Antenna", body: "Seamless indoor/outdoor positioning with centimeter-level accuracy. No GPS drift, no signal loss." },
  { icon: Camera, title: "Global Shutter Cameras", body: "Zero motion blur even at walking speed. Crystal-clear colorization for photorealistic 3D models." },
  { icon: Glasses, title: "AR Glasses Interface", body: "Real-time scan visualization, guidance, and controls right in your field of view. Truly hands-free operation." },
];

const specs = [
  ["180°", "LiDAR field of view"],
  ["±2cm", "RTK positioning accuracy"],
  ["0.0", "Motion blur (global shutter)"],
  ["4K", "Camera resolution"],
  ["6 hr", "Battery life"],
  ["1.2 kg", "Total weight"],
];

const useCases = [
  { icon: Building2, title: "Interior Mapping", body: "Walk through any building and capture complete floor plans in minutes." },
  { icon: Home, title: "Exterior Facades", body: "Capture building exteriors with precise measurements and textures." },
  { icon: Trees, title: "Landscape Survey", body: "Map terrain, vegetation, and outdoor spaces with RTK precision." },
  { icon: Factory, title: "Industrial Sites", body: "Document factories, warehouses, and infrastructure as-built conditions." },
  { icon: Palette, title: "Projection Mapping", body: "Create precise surface models for art installations and projection mapping." },
  { icon: Bot, title: "Robotic Autonomy", body: "Generate real-time spatial data for autonomous robot navigation and path planning." },
  { icon: Boxes, title: "Digital Twins", body: "Create accurate digital replicas for simulations, analysis, and virtual operations." },
  { icon: GraduationCap, title: "Robot Training", body: "Enable human-guided training for autonomous robots with real-time spatial awareness." },
];

const problems = [
  "Heavy tripod setups that slow you down",
  "Hours of post-processing alignment work",
  "Motion blur ruining your captures",
  "GPS drift killing accuracy indoors",
];

const solutions = [
  "Wearable design — just walk through any space",
  "Real-time SLAM processing, no alignment needed",
  "Global shutter cameras eliminate motion blur",
  "Dual RTK antenna for cm-level accuracy anywhere",
];

const testimonials = [
  { quote: "The hemispherical LiDAR is a game-changer. We mapped a 50,000 sq ft warehouse in under an hour with complete coverage.", name: "Marcus Chen", role: "Lead Surveyor, BuildTech Inc." },
  { quote: "Finally, a scanner that keeps up with me. No tripods, no motion blur, just walk and scan. It's revolutionized our workflow.", name: "Sarah Mitchell", role: "Principal Architect, Studio M" },
  { quote: "The indoor/outdoor RTK transition is seamless. We captured an entire campus—buildings and landscaping—in one continuous session.", name: "David Park", role: "GIS Director, Urban Planning Dept." },
];

const ScanAR = () => {
  const [showVideo, setShowVideo] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-24">
        <div className="absolute inset-0 grid-lines opacity-60 pointer-events-none" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div className="animate-fade-up">
              <p className="label-mono text-gold">scanAR · Shipping 2026</p>
              <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] tracking-[-0.03em] sm:text-6xl">
                Autonomous spatial
                <br />
                capture platform
              </h1>
              <p className="mt-7 max-w-xl text-muted-foreground leading-relaxed sm:text-lg">
                A hard-hat-mounted mapping system combining hemispherical LiDAR, global shutter imaging,
                and dual RTK positioning. Professional-grade capture of indoor and outdoor environments,
                performed at walking speed.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowVideo(true)}
                  className="group inline-flex items-center gap-2 bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-colors hover:bg-gold hover:text-accent-foreground"
                >
                  <Play className="h-4 w-4" />
                  Watch the platform
                </button>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 border border-border px-6 py-3.5 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
                >
                  Request availability
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
                <span className="label-mono text-muted-foreground">2-year warranty</span>
                <span className="label-mono text-muted-foreground">Ships 2026</span>
                <span className="label-mono text-muted-foreground">Patent pending</span>
              </div>
            </div>

            <div className="relative border border-border bg-surface">
              <img
                src={scanarProduct}
                alt="scanAR wearable AR SLAM scanner"
                className="h-[620px] w-full scale-125 object-contain p-2 animate-float"
              />
              <span className="absolute left-6 top-6 label-mono text-muted-foreground">Field unit</span>
            </div>
          </div>
        </div>
      </section>

      {/* CAPTURE / UNDERSTAND / DELIVER */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <p className="label-mono text-gold">Platform architecture</p>
            <h2 className="mt-5 font-display text-3xl leading-tight tracking-[-0.02em] sm:text-[2.6rem]">
              Capture. Understand. Deliver.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px border border-border bg-border lg:grid-cols-3">
            {capturePillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 90} className="bg-background p-8 lg:p-10">
                <span className="label-mono text-muted-foreground">{p.label}</span>
                <h3 className="mt-4 font-display text-2xl tracking-tight">{p.title}</h3>
                <ul className="mt-7 space-y-4">
                  {p.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid gap-px border border-border bg-border md:grid-cols-2">
          <Reveal className="bg-background p-10">
            <h2 className="font-display text-2xl tracking-tight">Traditional scanning is broken</h2>
            <ul className="mt-8 space-y-4">
              {problems.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-muted-foreground">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="bg-background p-10">
            <h2 className="font-display text-2xl tracking-tight">scanAR changes the workflow</h2>
            <ul className="mt-8 space-y-4">
              {solutions.map((s) => (
                <li key={s} className="flex gap-3 text-sm text-foreground/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <p className="label-mono text-gold">Engineering</p>
            <h2 className="mt-5 font-display text-3xl leading-tight tracking-[-0.02em] sm:text-[2.6rem]">
              Technology that doesn't exist anywhere else
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              scanAR was engineered from the ground up around proprietary sensing and positioning work
              you won't find in another scanner.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80} className="bg-background p-8">
                <f.icon className="h-6 w-6 text-gold" strokeWidth={1.4} />
                <h3 className="mt-6 font-display text-lg tracking-tight">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-px border-x border-b border-border bg-background">
            <img
              src={scanarGui}
              alt="scanAR Cam capture interface showing live RGB, depth, SLAM overview, and telemetry streams"
              loading="lazy"
              className="w-full object-contain"
            />
            <span className="block border-t border-border px-6 py-4 label-mono text-muted-foreground">
              scanAR Cam — live capture and health interface
            </span>
          </div>

          <div className="mt-px grid gap-px border-x border-b border-border bg-border md:grid-cols-3">
            {[
              { src: scanarBackpack, alt: "scanAR backpack-mounted capture unit", label: "Backpack unit" },
              { src: scanarDrone, alt: "scanAR aerial platform — front view of a caged multirotor drone with a red-mounted camera and glossy dome sensor, Scan AR branding on the upper module", label: "Aerial platform" },
              { src: scanarHelmetKit, alt: "scanAR sensor suite mounted on a carbon-fiber hard hat", label: "Wearable kit" },
            ].map((img) => (
              <figure key={img.label} className="bg-background">
                <img src={img.src} alt={img.alt} loading="lazy" className="h-[420px] w-full object-contain bg-white" />
                <figcaption className="border-t border-border px-6 py-4 label-mono text-muted-foreground">
                  {img.label}
                </figcaption>
              </figure>
            ))}
          </div>

        </div>
      </section>

      {/* SPECS */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <p className="label-mono text-gold">Specifications</p>
            <h2 className="mt-5 font-display text-3xl tracking-[-0.02em] sm:text-[2.6rem]">Technical specifications</h2>
          </Reveal>
          <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {specs.map(([value, label], i) => (
              <Reveal key={label} delay={i * 60} className="bg-background px-8 py-10">
                <div className="font-display text-4xl tracking-tight text-foreground">{value}</div>
                <div className="mt-3 label-mono text-muted-foreground">{label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <p className="label-mono text-gold">Field applications</p>
            <h2 className="mt-5 font-display text-3xl leading-tight tracking-[-0.02em] sm:text-[2.6rem]">
              One device. Endless applications.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              From architects to landscapers to robotics teams, scanAR changes how professionals capture
              the physical world.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((u, i) => (
              <Reveal key={u.title} delay={(i % 4) * 70} className="bg-background p-8">
                <u.icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
                <h3 className="mt-5 text-sm font-medium">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FIELD FEEDBACK */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <p className="label-mono text-gold">Field feedback</p>
            <h2 className="mt-5 font-display text-3xl tracking-[-0.02em] sm:text-[2.6rem]">From early deployments</h2>
          </Reveal>
          <div className="mt-14 grid gap-px border border-border bg-border lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 90} className="bg-background p-8">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mt-6 text-sm leading-relaxed text-foreground/80">"{t.quote}"</p>
                <div className="mt-7">
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="label-mono mt-1 text-muted-foreground">{t.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERABLES CTA */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal className="border border-border">
            <img src={showcaseDrone} alt="Aerial capture merged with terrestrial scan data" loading="lazy" className="h-[420px] w-full object-cover" />
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-3xl leading-tight tracking-[-0.02em] sm:text-[2.6rem]">
              Capture is only half the platform
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              scanAR data flows directly into AV Suite — structured into waypointed E57, aligned without
              control, classified against ReCap categories, and delivered as splats or self-hosted
              walkthroughs.
            </p>
            <Link to="/av-suite" className="group mt-9 inline-flex items-center gap-2 text-sm font-medium text-gold">
              Explore AV Suite
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {showVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-9 right-0 label-mono text-muted-foreground hover:text-gold"
            >
              Close
            </button>
            <video src="/videos/scanAR_product_video.mp4" controls autoPlay className="w-full border border-border" />
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
};

export default ScanAR;