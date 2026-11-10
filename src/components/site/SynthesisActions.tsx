import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoUrl, synthesisApplicationUrl, synthesisWorkspaceUrl } from "@/data/synthesis";

export default function SynthesisActions({ explore = false }: { explore?: boolean }) {
  return <div className="flex flex-wrap gap-3">
    {explore ? <Button asChild size="lg"><Link to="/av-synthesis">Explore AV Synthesis <ArrowRight /></Link></Button> : synthesisApplicationUrl ? <Button asChild size="lg"><a href={synthesisApplicationUrl}>Start AV Synthesis <ArrowRight /></a></Button> : null}
    <Button asChild size="lg" variant={explore || synthesisApplicationUrl ? "outline" : "default"}><a href={demoUrl}>Book a Demo <ArrowRight /></a></Button>
    {!synthesisApplicationUrl && <Button asChild size="lg" variant="ghost"><a href={synthesisWorkspaceUrl} target="_blank" rel="noopener noreferrer">AV Synthesis Login <ExternalLink /></a></Button>}
  </div>;
}