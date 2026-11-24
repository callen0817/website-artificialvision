import avIosLogo from "@/assets/av-ios-logo.png";
import avIosHero from "@/assets/av-ios-hero.jpg";
import type { SuiteProduct } from "@/data/site";

export const avIosProduct: SuiteProduct = {
  id: "av-ios",
  name: "AV iOS",
  stage: "Capture — iOS LiDAR mount & SLAM",
  tagline: "External LiDAR mounting and SLAM capture for iPad and iPhone",
  status: "iPad & iPhone · SLAM & Terrestrial Modes",
  logo: avIosLogo,
  image: avIosHero,
  imageCaption: "AV iOS LiDAR mount · Mounted on iPad, front, and side views",
  description:
    "AV iOS is a LiDAR mount for iPads and iPhones paired with the first iOS SLAM software that connects to external LiDAR hardware while using the iOS device's imaging sensors for camera capture and colorization. The mount allows external LiDAR to connect to iOS devices while also letting the devices attach to tripods and other 1/4\" mountable hardware. Capture on the move in SLAM mode, or switch to terrestrial mode when paired with the necessary motorized hardware for rotating terrestrial scans.",
  features: [
    "LiDAR mount for iPad and iPhone devices",
    "Connects external LiDAR hardware to iOS devices",
    "1/4\" mounting support for tripods and compatible hardware",
    "First iOS SLAM software supporting external LiDAR hardware",
    "Uses iOS imaging sensors for camera capture and point-cloud colorization",
    "SLAM mode and terrestrial mode (with compatible motorized hardware for rotating terrestrial scans)",
  ],
  outputs: ["SLAM scans", "Terrestrial scans", "iOS camera colorization"],
};
