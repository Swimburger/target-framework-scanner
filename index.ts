import { getInput, setOutput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { glob } from "glob";
import { parseProjectsInput } from "./src/parseProjectsInput";
import { promises as fs } from "fs";
import { getTfmsFromProjectFile } from "./src/getTfmFromProjectFile";
import { convertTfmToSetupDotNetVersion } from "./src/convertTfmToSetupDotNetVersion";

(async () => {
  try {
    const projectsGlobListString = getInput("projects");
    const projectsGlobList = parseProjectsInput(projectsGlobListString);
    const projectFiles = await glob(projectsGlobList);
    console.log(`Found ${projectFiles.length} project files`);
    console.log(projectFiles.map((f) => `\t${f}`).join("\n"));
    const tfmsByFile = await Promise.all(
      projectFiles.map(async (file) => {
        const content = await fs.readFile(file);
        const tfms = await getTfmsFromProjectFile(content);
        const pluralOrNot = tfms.length === 1 ? "TFM" : "TFMs";
        console.log(`Found ${tfms.length} ${pluralOrNot} in ${file}`);
        console.log(`\t${tfms.join(";")}`);
        return { file, tfms };
      }),
    );
    const allTfms = [...new Set(tfmsByFile.flatMap((x) => x.tfms))].sort();
    setOutput("tfms", allTfms);
    console.log(`All TFMs: ${allTfms.join(";")}`);
    const setupDotnetVersion = convertTfmToSetupDotNetVersion(allTfms);
    setOutput("setup-dotnet-version", setupDotnetVersion);
  } catch (error) {
    setFailed(error.message);
  }
})();
