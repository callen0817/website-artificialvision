import toolsMark from "../assets/av-tools-logo.png.asset.json";
import nfXplodeMark from "../assets/av-nf-xplode.png.asset.json";
import artwork from "../assets/av-tools-hero.jpg";
import downloadAsset from "../assets/nf-xplode-download.zip.asset.json";
import type { SuiteProduct } from "./site";

const assetUrl = (asset: { project_id: string; url: string }) =>
  import.meta.env?.DEV && typeof window !== "undefined" && window.location.hostname === "localhost"
    ? `https://id-preview--${asset.project_id}.lovable.app${asset.url}`
    : asset.url;

export interface RevitPlugin {
  id: string;
  name: string;
  icon: string;
  price: number;
  downloadUrl: string | null;
}

export const revitPlugins: RevitPlugin[] = [{
  id: "nf-xplode",
  name: "NF Xplode",
  icon: assetUrl(nfXplodeMark),
  price: 0,
  downloadUrl: assetUrl(downloadAsset),
}];

export const avToolsProduct: SuiteProduct = {
  id: "av-tools",
  name: "AV Tools",
  stage: "Tools — Revit plugins",
  tagline: "Free tools for your Revit workflow",
  logo: assetUrl(toolsMark),
  image: artwork,
  imageCaption: "Modular family workflows · Conceptual illustration",
  status: "Free to download and use",
  description: "AV Tools is a growing collection of free Revit plugins. The first tool, NF Xplode, simplifies a Revit family by exploding its nested families while retaining the scale you have set.",
  features: [
    "NF Xplode — simplify nested Revit families",
    "Keep the desired scale without the nested family elements",
    "Free to download and use",
  ],
  outputs: ["Simplified Revit families"],
};