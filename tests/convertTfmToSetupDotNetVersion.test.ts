import { expect, test } from "vitest";
import { convertTfmToSetupDotNetVersion } from "../src/convertTfmToSetupDotNetVersion";

test("should convert multiple tfms to setup dotnet version", async () => {
  const tfms = ["net481", "netstandard2.1", "net8.0", "net9.0"];
  const setupDotNetVersion = convertTfmToSetupDotNetVersion(tfms);
  expect(setupDotNetVersion).toEqual("8.0\n9.0");
});
test("should convert multiple tfms out of order and return in order", async () => {
  const tfms = ["net8.0", "netcoreapp3.1", "net9.0"];
  const setupDotNetVersion = convertTfmToSetupDotNetVersion(tfms);
  expect(setupDotNetVersion).toEqual("3.1\n8.0\n9.0");
});

test("should convert one tfm to setup dotnet version", async () => {
  const tfms = ["net8.0"];
  const setupDotNetVersion = convertTfmToSetupDotNetVersion(tfms);
  expect(setupDotNetVersion).toEqual("8.0");
});

test("should convert one tfm with minor version to setup dotnet version", async () => {
  const tfms = ["netcoreapp3.1"];
  const setupDotNetVersion = convertTfmToSetupDotNetVersion(tfms);
  expect(setupDotNetVersion).toEqual("3.1");
});

test("should convert tfms to setup dotnet version", async () => {
  const tfms = [];
  const setupDotNetVersion = convertTfmToSetupDotNetVersion(tfms);
  expect(setupDotNetVersion).toEqual("");
});
