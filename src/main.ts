import program from 'commander';
import {
  loadConfig,
  install,
  copyAssets,
  registerModules,
  createConfig,
  version
} from './utils';
import Options from './options';

program
  .version(version(), '-v, --version')
  .usage('[lib] [name] [options]')
  .arguments('[lib] [name]')
  .option(
    '-n, --name <name>',
    'set library name if installing from custom sources',
    null
  )
  .option('--init', 'create a new configuration file')
  .option('--module <module>', 'module to use for the registration', 'app')
  .option('--skip-install', 'skip installing library')
  .option('--skip-assets', 'skip copying assets')
  .option('--skip-module', 'skip module registration')
  .action((lib: string, name: string, options: Options) => {
    if (options.init) {
      createConfig();
      console.log('Created new ngi.json file');
      return;
    }

    const libName = name || lib;
    const moduleName = options.module;

    if (!libName) {
      return;
    }

    if (!options.skipInstall) {
      install(lib);
    }

    const config = loadConfig(libName);
    if (config) {
      if (!options.skipAssets) {
        copyAssets(libName, config);
      }
      if (!options.skipModule) {
        registerModules(moduleName, config);
      }
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
