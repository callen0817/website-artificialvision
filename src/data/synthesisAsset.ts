import asset from "@/assets/av-synthesis.png.asset.json";

// The CDN route is served by Lovable hosting, not the local Vite server.
export const synthesisAssetUrl = import.meta.env?.DEV && typeof window !== "undefined" && window.location.hostname === "localhost"
  ? `https://id-preview--${asset.project_id}.lovable.app${asset.url}`
  : asset.url;