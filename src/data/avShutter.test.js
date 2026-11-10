import { expect, test } from "bun:test";
import { avShutterVariants } from "./avShutter";

test("AV Shutter 360 monocular variant is coming soon", () => {
  const variant = avShutterVariants.find(item => item.name === "AV Shutter 360");
  expect(variant?.cameraType).toBe("Monocular");
  expect(variant?.status).toBe("Coming Soon");
});