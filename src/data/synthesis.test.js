import { describe, expect, test } from "bun:test";
import { consumesProcessingCapacity, processingPolicy } from "./synthesis";

describe("customer processing rules", () => {
  test("users are unlimited", () => expect(processingPolicy.users).toBe("unlimited"));
  test("collaborators are unlimited", () => expect(processingPolicy.collaborators).toBe("unlimited"));
  test("projects remain subject to platform and storage policies", () => expect(processingPolicy.projects).toBe("unlimited-subject-to-platform-and-storage-policies"));
  test("additional capacity is in 500-sheet blocks", () => expect(processingPolicy.addOnSheets).toBe(500));
  test("no final monthly allowance is invented", () => expect(processingPolicy.monthlyAllowance).toBeNull());
  test("no add-on price is invented", () => expect(processingPolicy.addOnPrice).toBeNull());
  test("initial AI analysis consumes capacity", () => expect(consumesProcessingCapacity("initial-analysis", true)).toBe(true));
  test("new sheet AI analysis consumes capacity", () => expect(consumesProcessingCapacity("new-sheet", true)).toBe(true));
  test("changed revision requiring AI consumes capacity", () => expect(consumesProcessingCapacity("revision-check", true)).toBe(true));
  test("unchanged revision check does not consume capacity", () => expect(consumesProcessingCapacity("revision-check", false)).toBe(false));
  test("actual AI reanalysis consumes capacity", () => expect(consumesProcessingCapacity("reanalysis", true)).toBe(true));
  test.each(["report", "evidence-review", "filter", "raci-review"])("%s is not separately metered", (activity) => expect(consumesProcessingCapacity(activity, true)).toBe(false));
});