import artificialVisionLogo from "@/assets/artificial-vision-logo-white.png";
import stereoAsset from "@/assets/av-shutter-360-stereo.jpg.asset.json";
import mountingAsset from "@/assets/av-shutter-360-mounting.jpg.asset.json";
import type { SuiteProduct } from "@/data/site";

const photoUrl = (asset: { project_id: string; url: string }) =>
  import.meta.env.DEV && typeof window !== "undefined" && window.location.hostname === "localhost"
    ? `https://id-preview--${asset.project_id}.lovable.app${asset.url}`
    : asset.url;

export const avShutterPhotos = [
  { src: photoUrl(stereoAsset), alt: "AV Shutter 360 Stereo panoramic camera — angled view showing camera pairs", caption: "Panoramic stereo camera · Angled view" },
  { src: photoUrl(mountingAsset), alt: "AV Shutter 360 camera — top-down view of the enclosure with adjustment knobs and mounting arm", caption: "Camera enclosure · Top view" },
];

export const avShutterVariants = [
  { name: "AV Shutter 360 Stereo", cameraType: "Stereo" },
  { name: "AV Shutter 360", cameraType: "Monocular", status: "Coming Soon" },
];

export const avShutterProduct: SuiteProduct = {
  id: "av-shutter-360",
  name: "AV Shutter 360 Stereo",
  stage: "Capture — Panoramic 360° cameras",
  tagline: "Panoramic vision for mapping, SLAM and VR.",
  status: "AV Shutter 360 monocular variant — Coming Soon",
  logo: artificialVisionLogo,
  image: avShutterPhotos[0].src,
  description: "AV Shutter 360 Stereo is a panoramic 360° stereo camera for mapping, SLAM, VR and spatial capture. Its monocular-camera variant, AV Shutter 360, is Coming Soon. Both versions feature RGB global-shutter cameras, stitched panoramic images and individual camera views, along with depth point-cloud generation. Threaded mounting on both sides supports multiple configurations, while an onboard 6-axis IMU enables tracking and SLAM capabilities out of the box.",
  features: [
    "Stereo and monocular camera configurations",
    "RGB global-shutter cameras on both versions",
    "Stitched panoramic imagery and individual camera views",
    "Depth point-cloud generation",
    "Threaded mounting on both sides for flexible configurations",
    "Onboard 6-axis IMU for tracking and SLAM",
  ],
  outputs: ["Panoramic images", "Individual camera views", "Depth point clouds"],
};