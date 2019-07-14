# Install

[![Build Status](https://dev.azure.com/ngstack/install/_apis/build/status/ngstack.install?branchName=master)](https://dev.azure.com/ngstack/install/_build/latest?definitionId=3&branchName=master)

Command-line utility for installing Angular libraries into the Angular CLI-based projects.

## Main features

- Install library from the NPM or local package (i.e. tarball file)
- Register assets, styles and scripts with `angular.json`
- Register library modules in the application
- Format updated application module with Prettier
- Generate new configuration file for a library

## Getting the tool

Install as a global package using the following command:

```sh
npm i -g @ngstack/install
```

You can use the tool everywhere using `ngi` alias.

## Options

Run `ngi` without parameters to see the internal help.

| Name               | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| -v, --version      | output the version number                                          |
| -n, --name \<name> | set library name if installing from custom sources (default: null) |
| --init             | create a new configuration file                                    |
| --module \<module> | module to use for the registration (default: app)                  |
| --import [modules] | list of modules to import                                          |
| --skip-install     | skip installing library                                            |
| --skip-assets      | skip copying assets                                                |
| --skip-module      | skip module registration                                           |
| --skip-format      | skip code formatting                                               |
| -h, --help         | output usage information                                           |

## Preparing libraries

Add and publish an `ngi.json` file as part of your library.

Example:

```json
{
  "assets": [
    {
      "glob": "**/*.json",
      "input": "./assets",
      "output": "./assets/plugins"
    }
  ],
  "modules": [
    {
      "name": "MyExtensionModule",
      "namespace": "my-extension"
    }
  ]
}
```

Based on the configuration above, the tool is going to perform the following actions:

- copy all JSON files from `assets` to the `assets/plugin` folder
- generate `import { MyExtensionModule } from 'my-extension';` in the `/src/app/app.module.ts`
- put the `MyExtensionModule` into the module `imports` section

### Asset configuration

The asset configuration format is based on the [Angular CLI settings](https://github.com/angular/angular-cli/wiki/stories-asset-configuration).
However, the `input` property defines the path relative to the library structure, rather than application one.

```json
{
  "glob": "**/*.json",
  "input": "./assets",
  "output": "./assets/plugins"
}
```

### Styles and Scripts

You can also register custom styles and scripts in the corresponding sections within `angular.json` file.

Example (**ngi.json**):

```json
{
  "styles": ["./styles/one.css", "./styles/two.css"],
  "scripts": ["./scripts/test1.js", "./scripts/test2.js"]
}
```

Upon execution the `ngi` tool is going to use relative paths to the extension folder.

Example (**angular.json**)

```json
{
  "styles": [
    "node_modules/my-extension/styles/one.css",
    "node_modules/my-extension/styles/two.css"
  ],
  "scripts": [
    "node_modules/my-extension/scripts/test1.js",
    "node_modules/my-extension/scripts/test2.js"
  ]
}
```

## Installing arbitrary libraries

The tool works best with the `ngi.json` configuration files that are published with the libraries.
However it is also possible to install an arbitrary Angular library.

In this case you need to provide one or multiple module names to import.

```sh
ngi @company/library --import=Module1,Module2
```

As a result of the command above, the tool is going to install `@company/library` from the NPM,
and setup the main application module with two imports:

```ts
import { Module1 } from '@company/library';
import { Module2 } from '@company/library';

@NgModule({
  imports: [Module1, Module2]
})
export class AppModule {}
```

Note that you will have to setup asset rules for `angular.json` file manually.

## Examples

Install library `my-extension` from the NPM
and perform integration tasks if `ngi.json` file present.

```ngi
ngi my-extension
```

Install library from the tarball generated by the `npm pack` command.
Use `my-extension` name to find and use library in the `node_modules`.

```sh
ngi my-extension-0.0.1.tgz my-extension
```

Perform only application module integration for manually installed library

```sh
ngi my-extension-0.0.1.tgz my-extension --skip-install --skip-assets
```

## License

MIT
