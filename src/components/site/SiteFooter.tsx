import { Link } from "react-router-dom";
import artificialVisionLogo from "@/assets/artificial-vision-logo-white.png";
import { CONTACT_EMAIL } from "@/data/site";

const columns = [
  {
    title: "Products",
    links: [
      { label: "AV Synthesis", to: "/av-synthesis" },
      { label: "AV Scan", to: "/av-scan" },
      { label: "AV Sort", to: "/av-sort" },
      { label: "AV Shift", to: "/av-shift" },
      { label: "scanAR", to: "/scanar" },
      { label: "AV Tools", to: "/av-suite#av-tools" },
      { label: "AV Hero", to: "/av-suite#av-hero" },
      { label: "AV Shutter 360", to: "/av-suite/av-shutter-360" },
      { label: "AV Structure", to: "/av-suite#av-structure" },
      { label: "AV Snap", to: "/av-suite#av-snap" },
      { label: "AV Segment", to: "/av-suite#av-segment" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Technology", to: "/technology" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Resources / Insights", to: "/insights" },
    ],
  },
];

export const SiteFooter = () => (
  <footer className="border-t border-border bg-background">
    <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
      <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-5">
          <Link to="/" className="flex items-center gap-3">
            <img src={artificialVisionLogo} alt="Artificial Vision" className="h-7 w-auto invert" />
            <span className="font-display text-[15px] font-semibold tracking-tight">Artificial Vision</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Construction technology for people and computers to better understand the built environment.
            Software, artificial intelligence, reality capture, and hardware.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="label-mono text-gold hover:text-gold-soft transition-colors inline-block"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="label-mono text-muted-foreground mb-5">{col.title}</h3>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-foreground/70 hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between gap-3">
        <p className="label-mono text-muted-foreground">© 2026 Artificial Vision, Inc.</p>
        <p className="label-mono text-muted-foreground">Find your sense.</p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;