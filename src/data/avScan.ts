import mark from "@/assets/av-scan-logo.png.asset.json";
import handheld1 from "@/assets/av-scan-handheld-unit-1.png.asset.json";
import handheld2 from "@/assets/av-scan-handheld-unit-2.png.asset.json";

const hosted = (asset: { project_id: string; url: string }) =>
  import.meta.env.DEV && typeof window !== "undefined" && window.location.hostname === "localhost"
    ? `https://id-preview--${asset.project_id}.lovable.app${asset.url}` : asset.url;

export const avScanImage = hosted(mark);
export const avScanHandheld1 = hosted(handheld1);
export const avScanHandheld2 = hosted(handheld2);
export const sensorClasses = [
  { name: "LiDAR", detail: "High-accuracy geometry and mapping.", example: "RoboSense Airy" },
  { name: "RGB-D / Stereo", detail: "Depth, visual geometry and native RGB capture.", example: "Orbbec Gemini 336L" },
  { name: "Cameras", detail: "Visual reconstruction from imaging hardware where supported.", example: "USB / UVC camera workflows" },
  { name: "IMU & Positioning", detail: "Motion and positioning information within compatible sensor-specific mapping pipelines.", example: "Pipeline-specific support" },
];
export const deviceProfiles = [
  { title: "Known devices", body: "Previously validated hardware can load established profiles." },
  { title: "Supported device families", body: "Manufacturer drivers and SDKs provide device capabilities and calibration." },
  { title: "Unknown devices", body: "If the available hardware capabilities support a valid spatial workflow, AV Scan can create an experimental device profile for qualification." },
];