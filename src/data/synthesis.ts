import { synthesisAssetUrl } from "@/data/synthesisAsset";
import { mailtoInquiry } from "@/data/site";

export const synthesisImage = synthesisAssetUrl;
// Deliberately unset until the production application and billing destination is verified.
export const synthesisApplicationUrl: string | null = null;
export const synthesisWorkspaceUrl = "https://lovable.dev/projects/2ffd9259-7321-4a62-8103-ba34a97f1014";
export const demoUrl = mailtoInquiry("AV Synthesis — Demo request", "I'd like a demonstration of AV Synthesis.\n\nName:\nCompany:\nProject interests:\n");
export const pricingInquiryUrl = mailtoInquiry("AV Synthesis — Processing capacity", "Please send current AV Synthesis pricing, monthly sheet allowances, 500-sheet add-on pricing, and storage/platform policies.");

export const processingPolicy = {
  users: "unlimited",
  collaborators: "unlimited",
  projects: "unlimited-subject-to-platform-and-storage-policies",
  addOnSheets: 500,
  monthlyAllowance: null,
  addOnPrice: null,
} as const;

export function consumesProcessingCapacity(activity: "initial-analysis" | "new-sheet" | "revision-check" | "reanalysis" | "report" | "evidence-review" | "filter" | "raci-review", performsAiProcessing: boolean): boolean {
  return ["initial-analysis", "new-sheet", "revision-check", "reanalysis"].includes(activity) && performsAiProcessing;
}

export const philosophy = [
  { title: "Verify", subtitle: "Know what you have.", body: "Establish the evidence in your project information before making decisions from it." },
  { title: "Direct", subtitle: "Know where it goes.", body: "Connect information to the people, responsibilities, and downstream work that depend on it." },
  { title: "Clarify", subtitle: "Know what you don't know.", body: "Make missing information, assumptions, and unresolved questions visible for human review." },
];