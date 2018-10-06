import sh from 'shelljs';
import path from 'path';
import fs from 'fs';

import Configuration from './configuration';
import TsUtils from './ts-utils';

export function loadConfig(lib: string): Configuration | undefined {
  const configPath = path.join(process.cwd(), 'node_modules', lib, 'ngi.json');

  try {
    return require(configPath);
  } catch {
    console.error('Error loading config');
    return undefined;
  }
}

export function install(lib: string): boolean {
  if (!lib) {
    return false;
  }

  console.info(`Installing ${lib}`);

  if (sh.exec(`npm i ${lib}`).code !== 0) {
    return false;
  }

  return true;
}

export function copyAssets(lib: string, config: Configuration): void {
  if (config && config.assets && config.assets.length > 0) {
    const libPath = path.join(process.cwd(), 'node_modules', lib);
    const localPath = path.join(process.cwd(), 'src/assets');

    sh.mkdir('-p', localPath);

    config.assets.forEach(asset => {
      const from = path.join(libPath, asset.from);
      const to = path.join(localPath, asset.to || '');

      sh.mkdir('-p', to);

      console.log(`Copy: ${asset.from}`);
      sh.cp(from, to);
    });
  }
}

export function registerModules(
  moduleName: string,
  config: Configuration
): void {
  if (config && config.modules && config.modules.length > 0) {
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
    console.log(output);
  }
}
