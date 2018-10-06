import program from 'commander';
import { loadConfig, install } from './utils';

program
  .version('0.1.0', '-v, --version')
  .usage('<lib>')
  .option(
    '-c, --config <path>',
    'set config path. defaults to ./ngi.json',
    './ngi.json'
  )
  .arguments('<lib>')
  .action((lib: string, options: any) => {
    const config = loadConfig(options.config);

    if (config) {
      console.log(config);

      install(lib);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
