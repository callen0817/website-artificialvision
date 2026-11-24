import { expect, test } from "bun:test";
import { revitPlugins } from "./avTools";

const downloadPath = new URL("../assets/nf-xplode-download.zip", import.meta.url);

test("NF Xplode is free to download and use", () => {
  const plugin = revitPlugins.find(plugin => plugin.id === "nf-xplode");
  expect(plugin?.price).toBe(0);
});

test("only one plugin is offered initially", () => {
  expect(revitPlugins.map(plugin => plugin.id)).toEqual(["nf-xplode"]);
});

test("NF Xplode downloads the supplied repository ZIP", async () => {
  expect(revitPlugins.find(plugin => plugin.id === "nf-xplode")?.downloadUrl).toBe(downloadPath.href);
  const file = Bun.file(downloadPath);
  expect(await file.exists()).toBe(true);
  expect(file.size).toBe(1117629);
});