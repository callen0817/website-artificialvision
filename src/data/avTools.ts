import toolsMark from "../assets/av-tools-logo.png";
import nfXplodeMark from "../assets/av-nf-xplode.png";
import artwork from "../assets/av-tools-hero.jpg";
import type { SuiteProduct } from "./site";

const downloadUrl = new URL("../assets/nf-xplode-download.zip", import.meta.url).href;

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
  icon: nfXplodeMark,
  price: 0,
  downloadUrl,
}];

export const avToolsProduct: SuiteProduct = {
  id: "av-tools",
  name: "AV Tools",
  stage: "Tools — Revit plugins",
  tagline: "Free tools for your Revit workflow",
  logo: toolsMark,
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