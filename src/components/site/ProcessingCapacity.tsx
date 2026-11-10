import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pricingInquiryUrl } from "@/data/synthesis";

export default function ProcessingCapacity() {
  return <section id="pricing" className="scroll-mt-24 border-t border-border py-20 lg:py-28">
    <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid gap-12 lg:grid-cols-2">
      <div><p className="label-mono text-gold">Processing Capacity</p><h2 className="mt-5 font-display text-3xl sm:text-4xl">Pay for processing.<br />Not participation.</h2><p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">Bring the whole project team into the same intelligence. AV Synthesis is priced primarily around Sheet Processing, not seats, professions, or RACI roles.</p>
        <ul className="mt-7 space-y-3 text-sm">{["Unlimited users", "Unlimited project collaborators", "Unlimited projects, subject to platform and storage policies"].map(item => <li key={item} className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-gold mt-0.5" />{item}</li>)}</ul>
        <Button asChild className="mt-8" size="lg"><a href={pricingInquiryUrl}>Request current pricing <ArrowRight /></a></Button>
      </div>
      <div className="border-y border-border divide-y divide-border">
        <div className="py-6"><h3 className="font-display text-xl">Monthly sheet-processing allowance</h3><p className="mt-3 text-sm text-muted-foreground leading-relaxed">Plans include a defined monthly allowance. Final plan allowances and prices are available by inquiry; no unconfirmed figures are listed here.</p></div>
        <div className="py-6"><h3 className="font-display text-xl">Additional 500-sheet blocks</h3><p className="mt-3 text-sm text-muted-foreground leading-relaxed">Add Processing Capacity when your document workload grows. Storage is secondary and subject to applicable platform policies.</p></div>
        <div className="py-6"><h3 className="font-display text-xl">Only processing counts</h3><p className="mt-3 text-sm text-muted-foreground leading-relaxed">Initial analysis and new sheets use capacity. Revised sheets use capacity when new or changed information requires AI processing; unchanged sheets do not use capacity merely because revisions were checked. Reanalysis may use capacity when AI processing actually occurs.</p><p className="mt-3 text-sm text-muted-foreground leading-relaxed">Reports, existing evidence review, normal filtering, RACI and accountability views, and previously processed structured intelligence are not separately metered features.</p></div>
      </div>
    </div>
  </section>;
}