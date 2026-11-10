import { ArrowDown, ArrowRight, Cable, ScanLine, Map, Combine, FolderCheck } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import Reveal from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { avScanImage, avScanHandheld1, avScanHandheld2, sensorClasses, deviceProfiles } from "@/data/avScan";
import { mailtoInquiry } from "@/data/site";

const stages = [
  { icon: Cable, title: "Connect", body: "Identify supported hardware and its available spatial workflows." },
  { icon: ScanLine, title: "Capture", body: "Acquire real sensor data in one standalone capture environment." },
  { icon: Map, title: "Map", body: "Use compatible SLAM and reconstruction pipelines to create spatial data." },
  { icon: Combine, title: "Combine", body: "Register compatible overlapping captures into a common coordinate space." },
  { icon: FolderCheck, title: "Deliver", body: "Save persistent projects and combined spatial datasets." },
];

function Flow({ items }: { items: string[] }) {
  return <ol className="flex flex-wrap items-center gap-x-5 gap-y-4 border-y border-border py-7">{items.map((item, index) => <li key={item} className="flex items-center gap-5 text-sm"><span>{item}</span>{index < items.length - 1 && <ArrowRight aria-hidden className="h-4 w-4 shrink-0 text-gold" />}</li>)}</ol>;
}

export default function AVScan() {
  return <div className="min-h-screen bg-background text-foreground"><SiteNav /><main>
    <section className="relative overflow-hidden pt-28 pb-14 lg:pt-36 lg:pb-20 border-b border-border">
      <div className="absolute inset-0 grid-lines pointer-events-none" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-mono text-gold">Artificial Vision · Universal Spatial Capture</p>
        <h1 className="font-display text-5xl sm:text-7xl mt-6">AV Scan</h1>
        <h2 className="font-display text-3xl sm:text-5xl mt-5">Any Sensor. <span className="text-gold">One Map.</span></h2>
        <p className="mt-7 max-w-3xl text-lg text-muted-foreground leading-relaxed">AV Scan is a universal spatial-capture platform that turns compatible sensing hardware into intelligent 3D mapping systems.</p>
        <p className="mt-5 max-w-3xl text-muted-foreground leading-relaxed">Connect LiDAR, RGB-D, stereo and camera hardware. Capture real environments. Register independent scans. Combine spatial data into a common project.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><a href="#connect">Explore AV Scan <ArrowRight /></a></Button><Button asChild size="lg" variant="outline"><a href="#how-it-works">See How It Works <ArrowDown /></a></Button></div>
        <div className="mt-12 pt-6 border-t border-border flex items-center gap-6"><div className="h-20 w-20 shrink-0 rounded-lg bg-background flex items-center justify-center p-2"><img src={avScanImage} alt="AV Scan product mark" className="h-full w-full object-contain" /></div><p className="text-sm text-muted-foreground">Different sensors. Different computers.<br /><span className="text-foreground">One spatial platform.</span></p></div>
      </div>
    </section>
    <section id="how-it-works" className="scroll-mt-24 py-20 lg:py-28"><div className="mx-auto max-w-[1400px] px-6 lg:px-10">
      <Reveal className="max-w-3xl"><p className="label-mono text-gold">The platform</p><h2 className="mt-5 font-display text-3xl sm:text-4xl">The software defines the scanner.</h2><p className="mt-6 text-muted-foreground leading-relaxed">Traditional spatial-capture systems are built around fixed hardware. AV Scan takes a different approach. The sensing hardware becomes modular. Connect supported sensors. AV Scan identifies their capabilities, selects the appropriate spatial pipeline, captures their data and produces a persistent spatial project.</p></Reveal>
      <div className="mt-10"><Flow items={["LiDAR / RGB-D / Stereo / Camera", "AV Scan", "Spatial Map"]} /></div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">{stages.map(stage => <Reveal key={stage.title} className="border-t border-border pt-6"><stage.icon className="h-6 w-6 text-gold" strokeWidth={1.4} /><h3 className="font-display text-xl mt-5">{stage.title}</h3><p className="text-sm text-muted-foreground leading-relaxed mt-4">{stage.body}</p></Reveal>)}</div>
    </div></section>
    <section id="connect" className="scroll-mt-24 border-t border-border py-20 lg:py-28"><div className="mx-auto max-w-[1400px] px-6 lg:px-10">
      <p className="label-mono text-gold">Connect · Sensor ecosystem</p><h2 className="font-display text-3xl sm:text-4xl mt-5">Connect the sensors you need.</h2><p className="max-w-3xl mt-6 text-muted-foreground leading-relaxed">Built around a sensor ecosystem, not one proprietary scanner. AV Scan determines what a connected device can provide and selects compatible capture and reconstruction workflows.</p>
      <div className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">{sensorClasses.map(sensor => <Reveal key={sensor.name} className="border-t border-border py-7"><h3 className="font-display text-xl">{sensor.name}</h3><p className="mt-4 text-sm text-muted-foreground leading-relaxed">{sensor.detail}</p><p className="mt-6 text-sm text-gold">{sensor.example}</p></Reveal>)}</div>
      <p className="mt-4 text-sm text-muted-foreground">Capabilities differ by sensor, calibration and available drivers. Compatibility is qualified, not universal.</p>
    </div></section>
    <section className="border-t border-border py-20 lg:py-28"><div className="mx-auto max-w-[1400px] px-6 lg:px-10">
      <p className="label-mono text-gold">Device understanding</p><h2 className="mt-5 font-display text-3xl sm:text-4xl">Connect hardware.<br />Let AV Scan understand it.</h2><p className="mt-6 max-w-3xl text-muted-foreground leading-relaxed">AV Scan inspects connected hardware to build a Device Profile: available connections, data streams, calibration, timing and compatible reconstruction methods.</p>
      <div className="mt-12 grid gap-10 md:grid-cols-3">{deviceProfiles.map((profile,index) => <Reveal key={profile.title} className="border-t border-border pt-7"><span className="label-mono text-gold">0{index+1}</span><h3 className="mt-4 text-xl font-display">{profile.title}</h3><p className="mt-4 text-muted-foreground text-sm leading-relaxed">{profile.body}</p></Reveal>)}</div>
    </div></section>
    <section className="border-t border-border py-20 lg:py-28"><div className="mx-auto max-w-[1400px] px-6 lg:px-10">
      <p className="label-mono text-gold">Capture & Map</p><h2 className="font-display text-3xl sm:text-4xl mt-5">Capture the physical world.</h2><p className="mt-6 max-w-3xl text-muted-foreground leading-relaxed">AV Scan provides one standalone capture environment across different spatial sensors and reconstruction methods. The operator works through AV Scan rather than separate manufacturer applications.</p>
      <div className="mt-10"><Flow items={["Create Project", "Select Sensor", "Start", "Capture", "Stop", "Save"]} /></div>
      <ul className="mt-7 grid gap-x-12 sm:grid-cols-2">{["Live 3D point-cloud visualization", "Live 2D spatial / floor-plan view where supported", "Capture status and sensor identity", "Persistent spatial projects"].map(item => <li className="border-b border-border py-4 text-sm" key={item}>{item}</li>)}</ul>
      <div className="mt-16 grid gap-10 lg:grid-cols-2"><Reveal><h3 className="font-display text-3xl">Build the scanner you need.</h3><p className="mt-5 text-muted-foreground leading-relaxed">A single AV Scan computer can operate multiple sensor instances. The architecture is modular, rather than requiring one predetermined sensor package.</p></Reveal><Reveal><Flow items={["Supported sensor instances", "One AV Scan Node"]} /><p className="mt-5 text-sm text-muted-foreground leading-relaxed">Multiple sensors can participate in the architecture today. This does not mean arbitrary sensors are automatically fused in real time. Calibrated sensor fusion remains on the roadmap.</p></Reveal></div>
    </div></section>
    <section className="border-t border-border py-20 lg:py-28"><div className="mx-auto max-w-[1400px] px-6 lg:px-10">
      <p className="label-mono text-gold">Optional hardware</p><h2 className="mt-5 font-display text-3xl sm:text-4xl">The AV Scan handheld unit.</h2><p className="mt-6 max-w-3xl text-muted-foreground leading-relaxed">This is the handheld unit for mapping with devices — the proprietary hardware option for anyone who would rather use it than their own laptop or compliant device. AV Scan runs on your own hardware; the handheld unit is the dedicated capture computer you carry into the field.</p>
      <div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-2">
        {[
          { src: avScanHandheld1, alt: "AV Scan handheld unit — three-quarter view showing Ethernet, USB and HDMI ports, ventilation slots and an illuminated power button", label: "AV Scan handheld unit — sensor and display connections" },
          { src: avScanHandheld2, alt: "AV Scan handheld unit — top view showing a mesh grille and active cooling fan", label: "AV Scan handheld unit — top panel with active cooling" },
        ].map(img => <figure key={img.label} className="bg-white"><img src={img.src} alt={img.alt} loading="lazy" className="h-[420px] w-full object-contain" /><figcaption className="border-t border-border px-6 py-4 label-mono text-muted-foreground">{img.label}</figcaption></figure>)}
      </div>
      <p className="mt-6 max-w-3xl text-sm text-muted-foreground leading-relaxed">Sensors connect to the unit over Ethernet or USB, with HDMI for a display and active cooling for extended capture. The handheld unit is optional — the same AV Scan capture and registration workflows run on a qualifying laptop or device.</p>
    </div></section>
    <section className="border-y border-border bg-surface py-20 lg:py-28"><div className="mx-auto max-w-[1400px] px-6 lg:px-10">
      <p className="label-mono text-gold">Combine · Registration</p><h2 className="mt-5 font-display text-3xl sm:text-5xl">Separate captures.<br />One coordinate space.</h2><p className="mt-7 max-w-3xl text-muted-foreground leading-relaxed">Not every environment is captured in one pass. AV Scan registers compatible overlapping point clouds from different sensors, sessions and projects. It automatically determines the rigid transformation required to align compatible metric datasets and creates a combined spatial result.</p>
      <div className="mt-12"><Flow items={["Airy LiDAR Capture + Gemini RGB-D Capture", "Automatic Registration", "Merged Spatial Dataset"]} /></div>
      <div className="mt-14 grid gap-12 md:grid-cols-2"><Reveal><h3 className="text-2xl font-display">Combine without destroying the source.</h3><p className="mt-5 text-muted-foreground leading-relaxed">Original captures remain preserved. AV Scan stores the transformation that places them into a common coordinate system, then saves registered datasets as a new combined spatial project. Source provenance stays intact.</p></Reveal><Reveal><h3 className="text-2xl font-display">Geometry with context.</h3><p className="mt-5 text-muted-foreground leading-relaxed">LiDAR can contribute geometry and reflectance; RGB-D or visual sensors can contribute geometry with native RGB. Registration preserves available source attributes in one coordinate space. AV Scan does not invent color for LiDAR points.</p><p className="mt-4 text-sm text-muted-foreground">Cyan / amber alignment views are diagnostic inspection colors, not stored point-cloud coloration.</p></Reveal></div>
    </div></section>
    <section className="py-20 lg:py-28"><div className="mx-auto max-w-[1400px] px-6 lg:px-10">
      <p className="label-mono text-gold">Cross-project registration</p><h2 className="mt-5 font-display text-3xl sm:text-4xl">The capture does not have to<br className="hidden sm:block" /> happen all at once.</h2><p className="mt-6 max-w-3xl text-muted-foreground leading-relaxed">Capture a building on different days, with different sensors or computers, as separate AV Scan projects. Select compatible overlapping spatial datasets and register them into a common result.</p><div className="mt-10"><Flow items={["Project A — LiDAR + Project B — RGB-D", "Register", "Combined Project"]} /></div>
      <div className="mt-14 border-t border-border pt-7"><p className="label-mono text-gold">Looking ahead · Roadmap</p><h3 className="mt-4 font-display text-2xl">Toward collaborative mapping.</h3><p className="mt-5 max-w-3xl text-muted-foreground leading-relaxed">The long-term architecture extends toward multi-device collaborative mapping and calibrated sensor fusion. These are roadmap directions, not claims of currently shipping functionality.</p></div>
    </div></section>
    <section className="border-t border-border py-20 lg:py-28"><div className="mx-auto max-w-[1400px] px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"><div><p className="label-mono text-gold">AV Scan</p><h2 className="mt-5 font-display text-3xl">Any Sensor. One Map.</h2><p className="mt-4 text-muted-foreground">Discuss supported hardware, product access and your capture workflow.</p></div><Button asChild size="lg"><a href={mailtoInquiry("AV Scan — Product inquiry", "I'd like to explore AV Scan.\n\nSensors:\nCapture workflow:\nCompany:\n")}>Inquire about AV Scan <ArrowRight /></a></Button></div></section>
  </main><SiteFooter /></div>;
}