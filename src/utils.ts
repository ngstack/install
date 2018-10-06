import sh from 'shelljs';
import path from 'path';

import Configuration from './configuration';

export function loadConfig(configPath: string): Configuration | null {
  const filePath = path.resolve(configPath);

  try {
    return require(filePath);
  } catch {
    console.error('Error loading config');
    return null;
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
