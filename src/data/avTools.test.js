import { expect, test } from "bun:test";
import { revitPlugins } from "./avTools";
import downloadAsset from "../assets/nf-xplode-download.zip.asset.json";

test("NF Xplode is free to download and use", () => {
  const plugin = revitPlugins.find(plugin => plugin.id === "nf-xplode");
  expect(plugin?.price).toBe(0);
});

test("only one plugin is offered initially", () => {
  expect(revitPlugins.map(plugin => plugin.id)).toEqual(["nf-xplode"]);
});

test("NF Xplode downloads the supplied ZIP", () => {
  expect(revitPlugins.find(plugin => plugin.id === "nf-xplode")?.downloadUrl).toBe(downloadAsset.url);
  expect(downloadAsset.original_filename).toBe("NX-Xplode-Revit-Plugin.zip");
});