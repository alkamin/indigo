import { Command, flags } from "@oclif/command";
import { cli } from "cli-ux";
import * as inq from "inquirer";
import * as fs from "fs";
import generate from "../../lib/generate-component";

const validateName = (message: string) => (name: string) =>
  RegExp(/^[^a-zA-Z_$]|[^0-9a-zA-Z_$]*$/).test(name) || message;

export default class Generate extends Command {
  static description = "Scaffold a new component";

  static flags = {
    help: flags.help({ char: "h" }),
    skipStory: flags.boolean({ default: false }),
  };

  static args = [
    {
      name: "componentName",
      required: true,
      description: "the name of the component you want to generate",
    },
  ];

  async run() {
    const {
      args: { componentName },
      flags: { skipStory },
    } = this.parse(Generate);

    if (!validateName(componentName)) {
      throw new Error("the package name must be URL safe");
    } else if (fs.existsSync(`./src/components/${componentName}`)) {
      throw new Error(
        `the directory 'src/components/${componentName}' already exists`
      );
    }

    cli.action.start(`generating ${componentName}`);

    try {
      await generate({
        name: componentName,
        skipStory,
      });
    } catch (e) {
      cli.action.stop(
        `An error occurred during the component generation process: ${e}`
      );
    }

    cli.action.stop(`${componentName} was successfully created!`);
  }
}
