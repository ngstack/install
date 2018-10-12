import sh from 'shelljs';
import path from 'path';
import fs from 'fs';
import prettier from 'prettier';

import log from './log';
import { Configuration } from './configuration';

export function loadConfig(lib: string): Configuration | undefined {
  const configPath = path.join(process.cwd(), 'node_modules', lib, 'ngi.json');

  try {
    return require(configPath);
  } catch {
    log.warning('Configuration file not found.');
    return undefined;
  }
}

export function createConfig(targetPath?: string): void {
  const outputPath = path.join(targetPath || process.cwd(), 'ngi.json');
  const data = JSON.stringify(
    {
      assets: [],
      modules: []
    },
    null,
    2
  );

  fs.writeFileSync(outputPath, data);
}

export function install(lib: string): boolean {
  if (!lib) {
    return false;
  }

  log.info(`Installing ${lib}`);

  if (sh.exec(`npm i ${lib}`).code !== 0) {
    return false;
  }

  return true;
}

export function version(): string {
  const packageInfo = require(path.join(__dirname, '..', 'package.json'));
  return packageInfo.version;
}

export function format(source: string): string {
  log.info('formatting code');

  const options = prettier.resolveConfig.sync(process.cwd()) || {
    parser: 'typescript',
    singleQuote: true
  };

  options.parser = options.parser || 'typescript';

  return prettier.format(source, options);
}
