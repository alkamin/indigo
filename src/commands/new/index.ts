import { Command, flags } from "@oclif/command";
import * as inq from "inquirer";
import { cli } from "cli-ux";
import generate from "./generate";

export type UserInput = {
  packageName: string;
  owner: string;
  repo: string;
};

const validateUrlSafeInput = (message: string) => (input: string) =>
  RegExp(/^[a-z0-9-][a-z0-9-_]*$/).test(input) || message;

export default class New extends Command {
  static description = "Scaffold a new library";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    const userInput = await inq.prompt<UserInput>([
      {
        type: "input",
        name: "packageName",
        message: "What is the name of the package?",
        validate: validateUrlSafeInput("the package name must be URL safe"),
      },
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
        message:
          "What is the name of the GitHub repository (https://github.com/owner/REPO)?",
        validate: validateUrlSafeInput("the repository name must be URL safe"),
        default: (answers: Partial<UserInput>) => answers.packageName,
      },
    ]);

    cli.action.start(`generating ${userInput.packageName}`);

    try {
      await generate(userInput);
    } catch (e) {
      cli.action.stop(
        `An error occurred during the library generation process: ${e}`
      );
    }

    cli.action.stop(`${userInput.packageName} was successfully created!`);
  }
}
