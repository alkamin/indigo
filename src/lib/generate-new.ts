import * as copyfiles from "copyfiles";
import * as glob from "glob";
import * as tmp from "tmp";
import * as dot from "dot";
import * as fs from "fs";
import * as child_process from "child_process";
import * as mv from "mv";
import * as _new from "../commands/new";

const generate = async (userInput: _new.UserInput): Promise<void> =>
  new Promise((resolve, reject) => {
    const targetDir = `./${userInput.packageName}`;

    // All work is done in a temporary directory in case things go wrong
    // temp directories are cleaned up by the OS
    const tmpDir = tmp.dirSync({
      unsafeCleanup: true,
    });

    // Excluded configs based on publishing decision
    const publishCopyExclusions = {
      [_new.PublishConfig.GITHUB]:
        "lib/templates/.github/workflows/publish-npm.yml.dot",
      [_new.PublishConfig.NPM]:
        "lib/templates/.github/workflows/publish-gpr.yml.dot",
      [_new.PublishConfig.NONE]: "./templates/.github/workflows/publish*.*",
    };

    const registryUrls = {
      [_new.PublishConfig.GITHUB]: "https://npm.pkg.github.com",
      [_new.PublishConfig.NPM]: "https://registry.npmjs.org",
      [_new.PublishConfig.NONE]: "",
    };

    // change delimiters to avoid conflicts with GH action expressions
    const dotConfig: Partial<dot.TemplateSettings> = {
      argName: ["packageName", "owner", "repo", "registryUrl"],
      delimiters: { start: "<%", end: "%>" },
      strip: false,
    };

    // copy relevant files to a temp directory
    copyfiles(
      ["lib/templates/**/*", tmpDir.name],
      {
        up: 2,
        all: true,
        exclude: publishCopyExclusions[userInput.publishConfig],
      },
      () => {
        // collect and hydrate template files, removing the .dot extension
        console.log(tmpDir.name);
        const templatePaths = glob.sync(`${tmpDir.name}/**/*.dot`, {
          dot: true,
        });
        templatePaths.forEach((templatePath) => {
          const content = fs.readFileSync(templatePath);
          const template = dot.template(content.toString(), dotConfig);
          fs.writeFileSync(
            templatePath.slice(0, -4),
            template({
              ...userInput,
              registryUrl: registryUrls[userInput.publishConfig],
            })
          );
          fs.unlinkSync(templatePath);
        });

        try {
          child_process.execSync("npm install --loglevel error", {
            cwd: tmpDir.name,
            encoding: "utf8",
          });
        } catch (e) {
          tmpDir.removeCallback();
          reject(
            "installation of dependencies could not be completed. Please note that indigo is not yet compatible with NPM 7"
          );
          return;
        }

        // only after all operations have completed successfully do we move
        // the result to the intended location
        mv(tmpDir.name, targetDir, (err: any) => {
          // tmpDir.removeCallback();
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
