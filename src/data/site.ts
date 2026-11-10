import avSegmentLogoAsset from "@/assets/av-segment-logo.png.asset.json";
import avSnapLogoAsset from "@/assets/av-snap-logo.png.asset.json";
import avSplatLogoAsset from "@/assets/av-splat-logo.png.asset.json";
import avStructureLogoAsset from "@/assets/av-structure-logo.png.asset.json";
import avShowcaseLogoAsset from "@/assets/av-showcase-logo.png.asset.json";
import avSegmentHero from "@/assets/av-segment-hero.jpg";
import avSnapHero from "@/assets/av-snap-hero.jpg";
import avSplatHero from "@/assets/av-splat-hero.jpg";
import avStructureHero from "@/assets/av-structure-hero.jpg";
import avShowcaseHero from "@/assets/av-showcase-hero.jpg";
import { synthesisAssetUrl } from "@/data/synthesisAsset";
import synthesisHero from "@/assets/av-synthesis-hero.jpg";
import { avScanImage } from "@/data/avScan";
import avScanHero from "@/assets/av-scan-hero.jpg";

const logoUrl = (asset: { project_id: string; url: string }) =>
  import.meta.env.DEV && typeof window !== "undefined" && window.location.hostname === "localhost"
    ? `https://id-preview--${asset.project_id}.lovable.app${asset.url}`
    : asset.url;

const avSegmentLogo = logoUrl(avSegmentLogoAsset);
const avSnapLogo = logoUrl(avSnapLogoAsset);
const avSplatLogo = logoUrl(avSplatLogoAsset);
const avStructureLogo = logoUrl(avStructureLogoAsset);
const avShowcaseLogo = logoUrl(avShowcaseLogoAsset);

export const CONTACT_EMAIL = "chris@consultc4.com";

export const mailtoInquiry = (subject: string, intro: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(intro)}`;

export interface SuiteProduct {
  id: string;
  name: string;
  stage: string;
  tagline: string;
  logo: string;
  image: string;
  description: string;
  features: string[];
  outputs: string[];
  status: string;
  href?: string;
  imageCaption?: string;
}

export const suiteProducts: SuiteProduct[] = [
  {
    id: "av-synthesis",
    name: "AV Synthesis",
    stage: "Pre-VDC — Project intelligence",
    tagline: "Evidence-backed construction project intelligence",
    logo: synthesisAssetUrl,
    image: synthesisHero,
    imageCaption: "Construction document intelligence · Conceptual illustration",
    status: "Primary commercial product",
    href: "/av-synthesis",
    description: "AI-powered Pre-VDC intelligence that transforms construction documents into connected, evidence-backed project information before modeling, coordination, and construction depend on it. Artificial Vision's first major commercial software release connects requirements, issue findings, assumptions, RFIs, responsibility, affected schedule activities, and readiness—with evidence-first human review.",
    features: ["Drawing and specification intelligence", "Evidence-linked requirements, issues, and assumptions", "RFIs, responsibility, assignment, and accountability", "Schedule relationships, Upcoming Work, and readiness", "Trade Intelligence, revisions, regulatory verification, search, and reports"],
    outputs: ["Project intelligence", "Evidence-linked findings", "Readiness states"],
  },
  {
    id: "av-scan",
    name: "AV Scan",
    stage: "Capture — Any Sensor. One Map.",
    tagline: "Universal Spatial Capture",
    logo: avScanImage,
    image: avScanHero,
    imageCaption: "Universal spatial capture · Conceptual illustration",
    status: "Primary software product",
    href: "/av-scan",
    description: "Turn compatible LiDAR, depth, stereo and camera hardware into intelligent spatial-capture systems. The software defines the scanner: connect supported sensors, capture real environments, map, register independent captures and deliver persistent spatial projects.",
    features: ["Physical sensor acquisition and SLAM / reconstruction", "Live point-cloud visualization and saved projects", "Multiple sensor instances and capability-based device profiles", "Cross-capture and cross-project registration", "Merged datasets with source captures preserved"],
    outputs: ["Spatial maps", "Registered captures", "Combined projects"],
  },
  {
    id: "av-structure",
    status: "In Development",
    name: "AV Structure",
    stage: "01 — Structure",
    tagline: "Structured spatial data processing",
    logo: avStructureLogo,
    image: avStructureHero,
    description:
      "AV Structure converts unstructured SLAM data into structured E57 files with embedded panospheres and Autodesk ReCap RealView spheres. Using pose information and captured photography or photogrammetry, it generates virtual waypoints that intelligently split point clouds along realistic scanner hardware fields of view. This is critical for merging LiDAR with photogrammetry — especially in the drone industry — and lets terrestrial-grade projects be completed faster on SLAM hardware without sacrificing the flexibility of terrestrial data.",
    features: [
      "Unstructured SLAM → structured E57",
      "Embedded panospheres and ReCap RealView spheres",
      "Pose-driven virtual waypoint generation",
      "FOV-aware intelligent point cloud splitting",
      "LiDAR + photogrammetry fusion for drone workflows",
    ],
    outputs: ["Structured E57", "RealView spheres", "Waypoint graph"],
  },
  {
    id: "av-snap",
    status: "In Development",
    name: "AV Snap",
    stage: "02 — Align",
    tagline: "Automated spatial alignment",
    logo: avSnapLogo,
    image: avSnapHero,
    description:
      "AV Snap aligns point clouds and models to themselves and to each other — cloud to cloud, model to model, cloud to model, and the reverse. Data is often captured without survey control, and AV Snap makes accurate registration possible regardless. It removes manual alignment time and user error, so it no longer matters whether a project has control: there is a repeatable path to an accurate alignment.",
    features: [
      "Point cloud ↔ point cloud registration",
      "Point cloud ↔ model registration",
      "Model ↔ model registration",
      "No survey control required",
      "Removes manual alignment time and human error",
    ],
    outputs: ["Registered datasets", "Transform matrices", "Deviation report"],
  },
  {
    id: "av-segment",
    status: "In Development",
    name: "AV Segment",
    stage: "03 — Classify",
    tagline: "AI-assisted point cloud classification",
    logo: avSegmentLogo,
    image: avSegmentHero,
    description:
      "AV Segment ingests a point cloud and segments the data automatically. Current support covers walls, windows, doors, floors, ceilings, and roofs, with further categories in development. Critically, the segmentation is compatible with Autodesk ReCap classifications, so results drop straight into existing documentation, BIM, and QA workflows without translation.",
    features: [
      "Walls, windows, doors, floors, ceilings, roofs",
      "Autodesk ReCap classification compatibility",
      "Additional categories in active development",
      "Batch processing across large captures",
      "Direct point cloud ingest",
    ],
    outputs: ["Classified point cloud", "ReCap-ready classes", "Per-class exports"],
  },
  {
    id: "av-splat",
    status: "In Development",
    name: "AV Splat",
    stage: "04 — Reconstruct",
    tagline: "Spatial visualization and reconstruction",
    logo: avSplatLogo,
    image: avSplatHero,
    description:
      "AV Splat converts point clouds into Gaussian splats — turning survey-grade capture data into continuous, photorealistic, real-time renderable scenes. Dense scans become lightweight visual assets suitable for review, presentation, web embedding, and immersive spatial experiences, while retaining the geometry of the source capture.",
    features: [
      "Point cloud → Gaussian splat conversion",
      "Photorealistic real-time rendering",
      "Lightweight output for web, AR, and VR",
      "Retains source capture geometry",
      "Batch conversion support",
    ],
    outputs: ["Gaussian splat scene", "Web-ready viewer asset"],
  },
  {
    id: "av-showcase",
    status: "In Development",
    name: "AV Showcase",
    stage: "05 — Deliver",
    tagline: "Offline digital twin environments",
    logo: avShowcaseLogo,
    image: avShowcaseHero,
    description:
      "AV Showcase converts point clouds into virtual walkthroughs comparable to Matterport and similar platforms. Point cloud data is structured, if it is not already, and the resulting panoramas and point cloud data are fused into an offline virtual walkthrough that can be embedded anywhere. Bypass steadily rising hosting fees by hosting your own captured data — or convert data you already host into something offline and permanently viewable.",
    features: [
      "Point cloud → navigable virtual walkthrough",
      "Panorama and point cloud fusion",
      "Offline capable and embeddable",
      "Self-hosted — no recurring platform fees",
      "Converts existing hosted tours to offline assets",
    ],
    outputs: ["Embeddable walkthrough", "Offline package", "Panorama set"],
  },
];