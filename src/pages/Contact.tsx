import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import Reveal from "@/components/site/Reveal";
import { CONTACT_EMAIL } from "@/data/site";

const field =
  "w-full bg-surface border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none transition-colors";

const Contact = () => {
  const send = (subject: string, body: string) => {
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="absolute inset-0 grid-lines opacity-60 pointer-events-none" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="max-w-3xl animate-fade-up">
            <p className="label-mono text-gold">Contact</p>
            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              Talk to the engineers
            </h1>
            <p className="mt-7 text-muted-foreground leading-relaxed sm:text-lg">
              AV Synthesis demonstrations and processing capacity, hardware availability, AV Suite development, pilot projects, and
              investment discussions. Direct line:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold hover:text-gold-soft">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid gap-px border border-border bg-border lg:grid-cols-2">
          {/* Early access */}
          <Reveal className="bg-background p-9 lg:p-12">
            <p className="label-mono text-gold">Early access</p>
            <h2 className="mt-5 font-display text-2xl tracking-tight">Be first to know</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Join the priority list for scanAR development milestones, beta testing opportunities, and
              early-bird pricing.
            </p>
            <form
              className="mt-8 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const f = e.currentTarget;
                const g = (n: string) => (f.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement)?.value ?? "";
                send(
                  "scanAR — Early Access Interest",
                  `Early Access Request:\n\nName: ${g("name")}\nEmail: ${g("email")}\nIndustry: ${g("industry")}\n`
                );
              }}
            >
              <input name="name" required placeholder="Your name" className={field} />
              <input name="email" type="email" required placeholder="Email address" className={field} />
              <select name="industry" defaultValue="" className={field}>
                <option value="" disabled>What's your industry?</option>
                <option value="architecture">Architecture</option>
                <option value="construction">Construction</option>
                <option value="surveying">Surveying &amp; Geospatial</option>
                <option value="engineering">Engineering</option>
                <option value="real-estate">Real Estate</option>
                <option value="other">Other</option>
              </select>
              <button
                type="submit"
                className="w-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-colors hover:bg-gold hover:text-accent-foreground"
              >
                Get early access updates
              </button>
            </form>
          </Reveal>

          {/* Investors */}
          <Reveal delay={100} className="bg-background p-9 lg:p-12">
            <p className="label-mono text-gold">Investment</p>
            <h2 className="mt-5 font-display text-2xl tracking-tight">Partner with us</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We're building spatial intelligence infrastructure for the built world. scanAR and AV Suite
              address a $12B+ market with patent-pending technology and a clear path to scale.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-foreground/80">
              {[
                "Patent-pending hemispherical LiDAR technology",
                "Pre-orders from Fortune 500 companies",
                "Experienced team from Apple, Google & FARO",
                "Series A round currently open",
              ].map((i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2.5 h-px w-4 shrink-0 bg-gold" />
                  {i}
                </li>
              ))}
            </ul>
            <form
              className="mt-8 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const f = e.currentTarget;
                const g = (n: string) =>
                  (f.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value ?? "";
                send(
                  "Artificial Vision — Investor Inquiry",
                  `Investment Inquiry:\n\nName: ${g("iname")}\nCompany/Fund: ${g("icompany")}\nEmail: ${g("iemail")}\nInvestment Interest: ${g("iinterest")}\nMessage: ${g("imessage")}\n`
                );
              }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="iname" required placeholder="Full name" className={field} />
                <input name="icompany" required placeholder="Company / fund" className={field} />
              </div>
              <input name="iemail" type="email" required placeholder="Email address" className={field} />
              <select name="iinterest" defaultValue="" className={field}>
                <option value="" disabled>Investment interest level</option>
                <option value="50k-250k">$50K – $250K</option>
                <option value="250k-1m">$250K – $1M</option>
                <option value="1m-5m">$1M – $5M</option>
                <option value="5m+">$5M+</option>
                <option value="strategic">Strategic partnership</option>
              </select>
              <textarea name="imessage" rows={2} placeholder="Brief message (optional)" className={`${field} resize-none`} />
              <button
                type="submit"
                className="w-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-colors hover:bg-gold hover:text-accent-foreground"
              >
                Request investor deck
              </button>
              <p className="label-mono text-muted-foreground">Accredited investors only. NDA required.</p>
            </form>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Contact;