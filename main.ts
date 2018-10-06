import program from 'commander';
import Install from './install';

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
    const install = new Install();
    install.run(lib);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
