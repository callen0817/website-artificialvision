import artificialVisionLogo from "@/assets/artificial-vision-logo-white.png";
import bannerAsset from "@/assets/av_hero_website_banner.jpg.asset.json";
import type { SuiteProduct } from "@/data/site";

const bannerUrl =
  import.meta.env.DEV && typeof window !== "undefined" && window.location.hostname === "localhost"
    ? `https://id-preview--${bannerAsset.project_id}.lovable.app${bannerAsset.url}`
    : bannerAsset.url;

export const avHeroProduct: SuiteProduct = {
  id: "av-hero",
  name: "AV Hero",
  stage: "Simulation — Reality-Capture Arcade RPG & Business Sim",
  tagline: "Retro arcade energy meets authentic 3D laser scanning physics & fieldwork ops.",
  status: "Playable in Browser & Desktop (Godot 4.7 WebAssembly)",
  logo: artificialVisionLogo,
  image: bannerUrl,
  description:
    "In AV Hero, reality-capture moves from the construction site into an explosive, 90s-inspired, web-based arcade RPG and business sim. Players mobilize across multistory isometric facilities, dodging site hazards, opening ceiling plenums, and deploying high-precision LiDAR and SLAM sensors. Every contract is an active trade-off between Speed, Accuracy, Completeness, Cost, and Risk. Pick the wrong tripod height, sprint too fast with a mobile SLAM rig, or track mud onto the client's fresh floors, and your firm will take heavy QC deductions on the settlement ledger.",
  features: [
    "Authentic Reality-Capture Physics: Genuine 360° mechanical stationary sweeps, red-to-green sector registration beams, ducking under tripods to avoid ghost points, and IMU perception drift when running with SLAM rigs.",
    "32 Reference Hardware Devices: Deploy terrestrial flagships, dual-laser mobile backpacks, caged drone inspection payloads, hardhat-mounted sensors, and autonomous quadruped robot dogs.",
    "Slapstick Fieldwork & Site Restoration: Uncleaned mud footprints bake into point-cloud noise artifacts (-$75 fine), unreplaced ceiling tiles trigger client penalties, and leaving a tripod on-site means losing the gear.",
    "10 Specialist Archetypes: Assemble your crew—from the high-speed Young Prodigy and capital-rich Veteran Surveyor to the Drone Pilot, Field Demolitionist, and Social Specialist.",
    "Firm Economics & Client GPA: Bid against rival firms with real-time countdown timers. Maintain a rolling 5-star GPA to unlock luxury estates and tech campuses, or face diminishing returns in crawlspaces.",
    "Multiplayer Co-Op & Mergers: Team up to service concurrent facilities, split contract revenue, and compete in head-to-head scan-offs on global leaderboards.",
  ],
  outputs: ["Browser & Desktop", "Arcade RPG", "Business Simulation"],
};