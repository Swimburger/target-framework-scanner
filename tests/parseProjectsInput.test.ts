import { expect, test } from "vitest";
import { parseProjectsInput } from "../src/parseProjectsInput";

test("should get one projects", async () => {
  const projectsInput = "src/MyProject.csproj";
  const projects = parseProjectsInput(projectsInput);
  expect(projects).toHaveLength(1);
  expect(projects).toContain("src/MyProject.csproj");
});

test("should get one projects", async () => {
  const projectsInput = `src/MyProject.csproj
  test/MyTestProject.csproj`;
  const projects = parseProjectsInput(projectsInput);
  expect(projects).toHaveLength(2);
  expect(projects).toContain("src/MyProject.csproj");
  expect(projects).toContain("test/MyTestProject.csproj");
});

test("should get no projects", async () => {
  const projectsInput = ``;
  const projects = parseProjectsInput(projectsInput);
  expect(projects).toHaveLength(0);
});
