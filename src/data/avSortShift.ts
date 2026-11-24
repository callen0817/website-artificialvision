import sortLogo from "@/assets/av-sort-logo.png";
import shiftLogo from "@/assets/av-shift-logo.png";
import avSortHero from "@/assets/av-sort-hero.jpg";
import avShiftHero from "@/assets/av-shift-hero.jpg";
import type { SuiteProduct } from "./site";

// Release status unverified: shown as not yet publicly released. No production URLs invented.
export const avSortProduct: SuiteProduct = {
  id: "av-sort",
  name: "AV Sort",
  stage: "Documents — PDF processing",
  tagline: "Batch PDF processing and sheet labeling",
  logo: sortLogo,
  image: avSortHero,
  status: "Coming soon — not yet publicly released",
  href: "/av-sort",
  description:
    "Intelligent batch PDF processing, searchable PDF conversion, automatic construction drawing titleblock recognition, and sheet labeling.",
  features: ["Batch PDF processing", "Searchable PDF conversion", "Titleblock recognition on construction drawings", "Automatic sheet labeling"],
  outputs: ["Searchable PDFs", "Labeled sheet sets"],
};

export const avShiftProduct: SuiteProduct = {
  id: "av-shift",
  name: "AV Shift",
  stage: "Conversion — Spatial data",
  tagline: "From spatial data and drawings to structured models",
  logo: shiftLogo,
  image: avShiftHero,
  status: "Coming soon — not yet publicly released",
  href: "/av-shift",
  description:
    "AI-assisted conversion and interpretation of spatial data, point clouds, and technical drawings into structured models and workflows.",
  features: ["AI-assisted interpretation of point clouds", "Technical drawing interpretation", "Conversion into structured models and workflows"],
  outputs: ["Structured models", "Workflow-ready data"],
};
