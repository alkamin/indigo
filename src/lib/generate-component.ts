import * as tmp from "tmp";
import * as dot from "dot";
import * as path from "path";
import * as copyfiles from "copyfiles";
import * as glob from "glob";
import * as fs from "fs";
import * as mv from "mv";
import * as findUp from "find-up";

type UserInput = {
  name: string;
  skipStory: boolean;
};

const generate = async (userInput: UserInput): Promise<void> =>
  new Promise((resolve, reject) => {
    const packageFilePath = findUp.sync("package.json");

    if (!packageFilePath) {
      throw new Error("A package.json file could not be found and is required");
    }

    const packageContents = JSON.parse(
      fs.readFileSync(packageFilePath).toString()
    );

    const isCreatedByIndigo = packageContents.indigo;

    if (!isCreatedByIndigo) {
      throw new Error(
        "This package doesn't seem to have been created with Indigo"
      );
    }

    const basePath = path.dirname(packageFilePath);

    const targetDir = `${basePath}/src/components/${userInput.name}`;

    const tmpDir = tmp.dirSync({
      unsafeCleanup: true,
    });

    const dotConfig: Partial<dot.TemplateSettings> = {
      argName: ["name"],
      delimiters: { start: "<%", end: "%>" },
      strip: false,
    };

    const templateSrc = path.join(__dirname, "../templates/component");
    const copySrc = `${templateSrc}/**/*`;

    copyfiles(
      [copySrc, tmpDir.name],
      {
        up: templateSrc.split("/").length,
        all: true,
        exclude: userInput.skipStory
          ? path.join(templateSrc, "/stories.tsx.dot")
          : undefined,
      },
      () => {
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
            })
          );
          fs.unlinkSync(templatePath);
        });

        // only after all operations have completed successfully do we move
        // the result to the intended location
        mv(tmpDir.name, targetDir, (err: any) => {
          tmpDir.removeCallback();
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
