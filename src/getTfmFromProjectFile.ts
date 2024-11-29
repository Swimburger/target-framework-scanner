import { XMLParser } from "fast-xml-parser";

type XmlProjectFile = [
  {
    Project: Array<{
      PropertyGroup?: Array<{
        TargetFramework?: [
          {
            "#text"?: string;
          },
        ];
        TargetFrameworks?: [
          {
            "#text"?: string;
          },
        ];
      }>;
    }>;
  },
];

export async function getTfmsFromProjectFile(
  projectFile: Buffer,
): Promise<string[]> {
  const allTfms: string[] = [];
  try {
    const parser = new XMLParser({
      preserveOrder: true,
    });
    let projectXml = parser.parse(projectFile);
    if (validateXml(projectXml)) {
      const project = projectXml[0].Project[0];
      if (project === undefined) {
        return [];
      }

      if ("PropertyGroup" in project && project.PropertyGroup) {
        for (const propertyGroup of project.PropertyGroup) {
          if (
            "TargetFramework" in propertyGroup &&
            propertyGroup.TargetFramework
          ) {
            const tfmNode = propertyGroup.TargetFramework[0];
            if (tfmNode && "#text" in tfmNode && tfmNode["#text"]) {
              allTfms.push(tfmNode["#text"]);
            }
          }
          if (
            "TargetFrameworks" in propertyGroup &&
            propertyGroup.TargetFrameworks
          ) {
            const tfmsNode = propertyGroup.TargetFrameworks[0];
            if (tfmsNode && "#text" in tfmsNode && tfmsNode["#text"]) {
              allTfms.push(...tfmsNode["#text"].split(";"));
            }
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  }

  return allTfms;
}

function validateXml(xml: XmlProjectFile | unknown): xml is XmlProjectFile {
  if (!Array.isArray(xml)) {
    console.warn("Invalid XML");
    return false;
  }
  if (xml.length !== 1) {
    console.warn("Only one root node allowed");
    return false;
  }

  if ("Project" in xml[0] === false) {
    console.warn("Root node must be Project");
    return false;
  }

  if (xml[0].Project.length === 0) {
    return true;
  }

  if (xml[0].Project.length > 1) {
    console.warn("Only one Project node allowed");
    return false;
  }

  const project = xml[0].Project[0];

  if ("PropertyGroup" in project === false) {
    return true;
  }

  if (!Array.isArray(project.PropertyGroup)) {
    console.warn("PropertyGroup must be an array");
    return false;
  }
  return true;
}
