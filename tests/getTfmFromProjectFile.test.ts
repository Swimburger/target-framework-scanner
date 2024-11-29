import { expect, test } from "vitest";
import { getTfmsFromProjectFile } from "../src/getTfmFromProjectFile";

test("should find single TFM", async () => {
  const project = Buffer.from(`
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <TargetFramework>net9.0</TargetFramework>
    </PropertyGroup>
</Project>
  `);
  const tfms = await getTfmsFromProjectFile(project);
  expect(tfms).toHaveLength(1);
  expect(tfms).toContain("net9.0");
});

test("should find multiple TFMs", async () => {
  const project = Buffer.from(`
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <TargetFrameworks>net481;netstandard2.1;netcoreapp3.1;net8.0;net9.0</TargetFramework>
    </PropertyGroup>
</Project>
  `);
  const tfms = await getTfmsFromProjectFile(project);
  expect(tfms).toHaveLength(5);
  expect(tfms).toContain("net481");
  expect(tfms).toContain("netstandard2.1");
  expect(tfms).toContain("netcoreapp3.1");
  expect(tfms).toContain("net8.0");
  expect(tfms).toContain("net9.0");
});

test("should find no TFM when TFM is empty", async () => {
  const project = Buffer.from(`
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <TargetFramework></TargetFramework>
    </PropertyGroup>
</Project>
  `);
  const tfms = await getTfmsFromProjectFile(project);
  expect(tfms).toHaveLength(0);
});

test("should find no TFM when TFMs is empty", async () => {
  const project = Buffer.from(`
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <TargetFrameworks></TargetFramework>
    </PropertyGroup>
</Project>
  `);
  const tfms = await getTfmsFromProjectFile(project);
  expect(tfms).toHaveLength(0);
});

test("should find no TFM when missing", async () => {
  const project = Buffer.from(`
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
    </PropertyGroup>
</Project>
  `);
  const tfms = await getTfmsFromProjectFile(project);
  expect(tfms).toHaveLength(0);
});

test("should find no TFM there are no PropertyGroups", async () => {
  const project = Buffer.from(`
<Project Sdk="Microsoft.NET.Sdk">
</Project>
  `);
  const tfm = await getTfmsFromProjectFile(project);
  expect(tfm).toHaveLength(0);
});

test("should find no TFM with empty csproj", async () => {
  const project = Buffer.from(` `);
  const tfm = await getTfmsFromProjectFile(project);
  expect(tfm).toHaveLength(0);
});

test("should find no TFM with unknown root node", async () => {
  const project = Buffer.from(`<UnknownNode></UnknownNode>`);
  const tfm = await getTfmsFromProjectFile(project);
  expect(tfm).toHaveLength(0);
});
