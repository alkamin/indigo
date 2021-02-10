import copyfiles = require("copyfiles");
import { sync as globSync } from "glob";
import * as tmp from "tmp";
import * as dot from "dot";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import * as mv from "mv";
import { UserInput } from "../commands/new";

const generate = async (userInput: UserInput): Promise<void> =>
  new Promise((resolve, reject) => {
    // can't proceed if the dir exists already -- could ask to name target directory in this case
    const targetDir = `./${userInput.packageName}`;
    if (existsSync(targetDir)) {
      reject(`the directory '${userInput.packageName}' already exists`);
      return;
    }

    const tmpDir = tmp.dirSync();
    const dotConfig: Partial<dot.TemplateSettings> = {
      argName: ["packageName", "owner", "repo"],
      delimiters: { start: "<%", end: "%>" },
    };
    // copy everything to a temp directory
    copyfiles(
      ["./templates/library/**/*", tmpDir.name],
      {
        up: 2,
        all: true,
      },
      () => {
        const templatePaths = globSync(`${tmpDir.name}/**/*.dot`, {
          dot: true,
        });
        templatePaths.forEach((templatePath) => {
          const content = readFileSync(templatePath);
          const template = dot.template(content.toString(), dotConfig);
          writeFileSync(templatePath.slice(0, -4), template(userInput));
          unlinkSync(templatePath);
        });
        try {
          execSync("npm install --loglevel error", {
            cwd: tmpDir.name,
            encoding: "utf8",
          });
        } catch (e) {
          reject(
            "installation of dependencies could not be completed. Please note that indigo is not yet compatible with NPM 7"
          );
          return;
        }
        mv(tmpDir.name, targetDir, (err: any) => {
          if (err) {
            reject(`when attempting to copy files: ${err}`);
          } else {
            resolve();
          }
        });
      }
    );
    return;
  });

export default generate;
