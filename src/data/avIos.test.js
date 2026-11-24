import { expect, test } from "bun:test";
import { avIosProduct } from "./avIos";

test("AV iOS product metadata uses expected id and supplied assets", () => {
  expect(avIosProduct.id).toBe("av-ios");
  expect(avIosProduct.name).toBe("AV iOS");
  expect(avIosProduct.logo).toBeTruthy();
  expect(avIosProduct.image).toBeTruthy();
});

test("AV iOS covers mounting, external LiDAR, iOS colorization, and scan modes", () => {
  const combined = `${avIosProduct.description} ${avIosProduct.features.join(" ")}`.toLowerCase();
  expect(combined).toContain("ipad");
  expect(combined).toContain("iphone");
  expect(combined).toContain("1/4\"");
  expect(combined).toContain("external lidar");
  expect(combined).toContain("colorization");
  expect(combined).toContain("slam");
  expect(combined).toContain("terrestrial");
});
