import program from 'commander';
import {
  loadConfig,
  install,
  registerModules,
  createConfig,
  version
} from './utils';
import Options from './options';
import log from './log';
import { registerAssets } from './assets';

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
  .option('--skip-format', 'skip code formatting')
  .action((lib: string, name: string, options: Options) => {
    if (options.init) {
      createConfig();
      log.success('Created new ngi.json file');
      console.log('✨ Done');
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
        registerAssets(libName, config);
      }
      if (!options.skipModule) {
        registerModules(moduleName, config, options.skipFormat);
      }
    }

    console.log('✨ Done');
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
