import sh from 'shelljs';
import path from 'path';
import fs from 'fs';
import prettier from 'prettier';

import TsUtils from './ts-utils';
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

export function registerModules(
  moduleName: string,
  config: Configuration,
  skipFormat?: boolean
): void {
  if (config && config.modules && config.modules.length > 0) {
    log.info('registering modules');

    const modulePath = path.join(
      process.cwd(),
      'src/app',
      `${moduleName}.module.ts`
    );

    const source = fs.readFileSync(modulePath).toString();
    const tsUtils = new TsUtils();

    let sourceFile = tsUtils.parse(source);
    sourceFile = tsUtils.registerModules(sourceFile, config.modules);

    const output = tsUtils.renderFile(sourceFile);
    fs.writeFileSync(modulePath, skipFormat ? output : format(output));
  }
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
