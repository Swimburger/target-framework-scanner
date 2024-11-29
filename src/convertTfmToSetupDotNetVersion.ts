export function convertTfmToSetupDotNetVersion(tfms: string[]): string {
  return tfms
    .filter((tfm: string) => !tfm.startsWith("net4"))
    .filter((tfm: string) => !tfm.startsWith("netstandard"))
    .map((tfm: string) => tfm.replace("netcoreapp", ""))
    .map((tfm: string) => tfm.replace("net", ""))
    .sort()
    .join("\n");
}
