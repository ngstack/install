import program from 'commander';
import { loadConfig, install, copyAssets } from './utils';
import Options from './options';

program
  .version('0.1.0', '-v, --version')
  .usage('<lib> [name] [options]')
  .arguments('<lib> [name]')
  .option(
    '-n, --name <name>',
    'set library name if installing from custom sources',
    null
  )
  .option('--module', 'module to use for the registration', 'app')
  .option('--skip-install', 'skip installing dependency')
  .action((lib: string, name: string, options: Options) => {
    const libName = name || lib;

    if (!options.skipInstall) {
      install(lib);
    }

    const config = loadConfig(libName);
    if (config) {
      copyAssets(libName, config);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
