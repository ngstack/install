import program from 'commander';
import { loadConfig, install } from './utils';

program
  .version('0.1.0', '-v, --version')
  .usage('<lib> [name] [options]')
  .arguments('<lib> [name]')
  .option(
    '-n, --name <name>',
    'set library name if installing from custom sources',
    null
  )
  .option('--skip-install', 'skip installing dependency')
  .action((lib: string, name: string, options: any) => {
    console.log(name, options.skipInstall);

    if (!options.skipInstall) {
      install(lib);
    }

    const config = loadConfig(name || lib);
    console.log(config);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
