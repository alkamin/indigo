import { Command, flags } from "@oclif/command";
import { cli } from "cli-ux";
import * as inq from "inquirer";
import * as fs from "fs";
import generate from "../../lib/generate-new";

export type UserInput = {
  packageName: string;
  owner: string;
  repo: string;
  publishConfig: PublishConfig;
};

export enum PublishConfig {
  "GITHUB",
  "NPM",
  "NONE",
}

const validateUrlSafeInput = (message: string) => (input: string) =>
  RegExp(/^[a-z0-9-][a-z0-9-_]*$/).test(input) || message;

export default class New extends Command {
  static description = "Scaffold a new UI library";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "packageName",
      required: true,
      description: "the name of the package you want to generate",
    },
  ];

  async run() {
    const {
      args: { packageName },
    } = this.parse(New);

    if (!validateUrlSafeInput(packageName)) {
      throw new Error("the package name must be URL safe");
    } else if (fs.existsSync(`./${packageName}`)) {
      throw new Error(`the directory '${packageName}' already exists`);
    }

    const userInput = await inq.prompt<Omit<UserInput, "packageName">>([
      {
        type: "input",
        name: "owner",
        message:
          "Who is the owner of the GitHub repository (https://github.com/OWNER/repo)?",
        validate: validateUrlSafeInput("the owner must be URL safe"),
      },
      {
        type: "input",
        name: "repo",
        message: `What is the name of the GitHub repository (https://github.com/owner/REPO)? [${packageName}]`,
        validate: validateUrlSafeInput("the repository name must be URL safe"),
        default: () => packageName,
      },
      {
        type: "list",
        name: "publishConfig",
        message: "Select a registry for package publication:",
        choices: [
          {
            name: "NPM",
            value: PublishConfig.NPM,
          },
          {
            name: "GPR (Github Package Registry)",
            value: PublishConfig.GITHUB,
          },
          {
            name: "None",
            value: PublishConfig.NONE,
          },
        ],
      },
    ]);

    cli.action.start(`generating ${packageName}`);

    try {
      await generate({
        ...userInput,
        packageName,
      });
    } catch (e) {
      cli.action.stop(
        `An error occurred during the library generation process: ${e}`
      );
    }

    cli.action.stop(`${packageName} was successfully created!`);
  }
}
