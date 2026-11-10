import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const metadata: Record<string, [string, string]> = {
  "/": ["Artificial Vision — AV Synthesis | Find your sense.", "AV Synthesis connects evidence-backed construction project intelligence before VDC begins. Artificial Vision develops software, AI, reality capture and hardware."],
  "/av-synthesis": ["AV Synthesis — Pre-VDC prepares the preconstruction | Artificial Vision", "Verify. Direct. Clarify. Explore evidence-backed project intelligence, connected responsibilities, and sheet-processing capacity with AV Synthesis."],
  "/av-sort": ["AV Sort — Batch PDF processing and sheet labeling | Artificial Vision", "Intelligent batch PDF processing, searchable PDF conversion, titleblock recognition and sheet labeling. Coming soon."],
  "/av-shift": ["AV Shift — Spatial data to structured models | Artificial Vision", "AI-assisted conversion of spatial data, point clouds and technical drawings into structured models and workflows. Coming soon."],
  "/av-scan": ["AV Scan — Any Sensor. One Map. | Artificial Vision", "Universal spatial capture with supported LiDAR, RGB-D, stereo and cameras. Capture, map, register independent scans and preserve source data with AV Scan."],
  "/av-suite": ["AV Suite — Software ecosystem | Artificial Vision", "Explore AV Synthesis and AV Scan alongside AV Structure, AV Snap, AV Segment, AV Splat and AV Showcase."],
  "/scanar": ["scanAR — Spatial capture hardware | Artificial Vision", "Explore scanAR capture hardware, LiDAR, imaging, positioning and the Artificial Vision software ecosystem."],
  "/technology": ["Technology | Artificial Vision", "Artificial intelligence, computer vision, spatial intelligence and reality capture for the built environment."],
  "/about": ["About Artificial Vision — Find your sense.", "Construction, BIM, VDC and reality-capture experience behind Artificial Vision's software and hardware."],
  "/contact": ["Contact Artificial Vision", "Discuss AV Synthesis demos, software, reality capture, hardware and partnerships with Artificial Vision."],
  "/insights": ["Resources & Insights | Artificial Vision", "Artificial Vision product releases, construction technology insights and company updates."],
};
export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const [title, description] = metadata[pathname] ?? (pathname.startsWith("/av-suite/") ? metadata["/av-suite"] : undefined) ?? ["Page not found | Artificial Vision", "Explore Artificial Vision's construction technology products."];
    document.title = title;
    for (const [selector, content] of [["meta[name='description']", description], ["meta[property='og:title']", title], ["meta[property='og:description']", description], ["meta[name='twitter:title']", title], ["meta[name='twitter:description']", description]]) document.querySelector(selector)?.setAttribute("content", content);
    document.querySelector("link[rel='canonical']")?.setAttribute("href", `https://artificialviz.com${pathname === "/" ? "/" : pathname}`);
  }, [pathname]);
  return null;
}