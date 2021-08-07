# indigo

Create a chakra-ui based application component library with one command

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![Version](https://img.shields.io/npm/v/@alkamin/indigo.svg)](https://www.npmjs.com/package/@alkamin/indigo)
[![Downloads/week](https://img.shields.io/npm/dw/@alkamin/indigo.svg)](https://www.npmjs.com/package/@alkamin/indigo)
[![License](https://img.shields.io/npm/l/@alkamin/indigo.svg)](https://github.com/alkamin/indigo/blob/master/package.json)

Libaries created with Indigo are pre-configured with:

- GitHub actions based build process with [semantic-release](https://github.com/semantic-release/semantic-release) and automated changelog generation and publishing to the GitHub Package Repository (GPR) or NPM
- TypeScript
- Storybook

## Getting started

Indigo works with node versions < v15. We encourage using [`nvm`](https://github.com/nvm-sh/nvm) to easily manage your node versions.

If you're using `nvm` you can ensure you're on the right version with `nvm use 14`.

```
$ npx @alkamin/indigo new my-component-library
$ cd my-component-library
$ npm start
```

## CI/CD Configuration

Defining a repository secret named `RELEASE_PAT` is required for the semantic release workflow. The user who owns the token will be listed as the creator of all releases triggered by the semantic release GitHub action.

### Publishing to NPM

If you choose NPM as your publishing method, you will need to provide an NPM token (`NPM_TOKEN`) to the build process:

- generate an NPM access token -- [NPM provides helpful guidance](https://docs.npmjs.com/creating-and-viewing-access-tokens)
- in your UI library's repository, create a secret named `NPM_TOKEN` and set the value to the token you created in the previous step

## Changing the commit message format

By default, Indigo configures semantic-release to use the `conventionalcommits` preset. Read more about [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
You can alter the `preset` setting of the `@semantic-release/commit-analyzer` and `@semantic-release/release-notes-generator` plugins in your library's `package.json` file. Read more about [configuring the commit message format](https://github.com/semantic-release/semantic-release/blob/master/README.md#commit-message-format)

## Changing the changelog file

By default, Indigo configures the build process to generate a `CHANGELOG.md` file. If you'd like to use a different name for the changelog file alter the configuration of the `@semantic-release/changelog` and `@semantic-release/git` plugins in your library's `package.json` file.

<!-- toc -->
* [indigo](#indigo)
<!-- tocstop -->

## CLI usage

<!-- usage -->
```sh-session
$ npm install -g @alkamin/indigo
$ indigo COMMAND
running command...
$ indigo (-v|--version|version)
@alkamin/indigo/1.4.1 linux-x64 node-v12.22.4
$ indigo --help [COMMAND]
USAGE
  $ indigo COMMAND
...
```
<!-- usagestop -->

## Commands

<!-- commands -->
* [`indigo help [COMMAND]`](#indigo-help-command)
* [`indigo new PACKAGENAME`](#indigo-new-packagename)

## `indigo help [COMMAND]`

display help for indigo

```
USAGE
  $ indigo help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `indigo new PACKAGENAME`

Scaffold a new UI library

```
USAGE
  $ indigo new PACKAGENAME

ARGUMENTS
  PACKAGENAME  the name of the package you want to generate

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/new/index.ts](https://github.com/alkamin/indigo/blob/v1.4.1/src/commands/new/index.ts)_
<!-- commandsstop -->
