import sh from 'shelljs';
import path from 'path';

import Configuration from './configuration';

export function loadConfig(lib: string): Configuration | null {
  const configPath = path.join(process.cwd(), 'node_modules', lib, 'ngi.json');

  try {
    return require(configPath);
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
