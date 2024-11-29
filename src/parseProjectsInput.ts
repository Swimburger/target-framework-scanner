export function parseProjectsInput(projectsGlobListString: string): string[] {
  return projectsGlobListString
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
