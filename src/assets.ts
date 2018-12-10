import path from 'path';
import fs from 'fs';

import log from './log';
import AngularConfig from './angular-config';
import { Configuration, GlobRule } from './configuration';

const configPath = path.join(process.cwd(), 'angular.json');

function loadConfig(): AngularConfig {
  try {
    const angularConfig = require(configPath);
    return angularConfig;
  } catch {
    log.warning('angular.json file not found.');
    return null;
  }
}

function saveConfig(config: AngularConfig) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function registerAssets(lib: string, config: Configuration) {
  if (!config || !config.assets || config.assets.length === 0) {
    return;
  }

  log.info('registering assets');

  const angularConfig = loadConfig();
  if (!angularConfig) {
    return;
  }

  const project = angularConfig.projects[angularConfig.defaultProject];
  if (!project) {
    log.warning(`project ${angularConfig.defaultProject} not found`);
    return;
  }

  const buildAssets = project.architect.build.options.assets || [];
  const testAssets = project.architect.test.options.assets || [];

  for (let rule of config.assets) {
    if (typeof rule === 'object') {
      registerObject(lib, buildAssets, rule);
      registerObject(lib, testAssets, rule);
    }

    if (typeof rule === 'string') {
      registerString(lib, buildAssets, rule);
      registerString(lib, testAssets, rule);
    }
  }

  project.architect.build.options.assets = buildAssets;
  project.architect.test.options.assets = testAssets;

  saveConfig(angularConfig);
}

export function registerStyles(lib: string, config: Configuration) {
  if (!config || !config.styles || config.styles.length === 0) {
    return;
  }

  log.info('registering styles');

  const angularConfig = loadConfig();
  if (!angularConfig) {
    return;
  }

  const project = angularConfig.projects[angularConfig.defaultProject];
  if (!project) {
    log.warning(`project ${angularConfig.defaultProject} not found`);
    return;
  }

  const buildStyles = project.architect.build.options.styles || [];
  const testStyles = project.architect.test.options.styles || [];
  const libPath = path.join('node_modules', lib);

  for (const stylePath of config.styles) {
    const libStylePath = path.join(libPath, stylePath);

    if (!buildStyles.includes(libStylePath)) {
      buildStyles.push(libStylePath);
    }

    if (!testStyles.includes(libStylePath)) {
      testStyles.push(libStylePath);
    }
  }

  project.architect.build.options.styles = buildStyles;
  project.architect.test.options.styles = testStyles;
  saveConfig(angularConfig);
}

export function registerScripts(lib: string, config: Configuration) {
  if (!config || !config.scripts || config.scripts.length === 0) {
    return;
  }

  log.info('registering scripts');

  const angularConfig = loadConfig();
  if (!angularConfig) {
    return;
  }

  const project = angularConfig.projects[angularConfig.defaultProject];
  if (!project) {
    log.warning(`project ${angularConfig.defaultProject} not found`);
    return;
  }

  const buildScripts = project.architect.build.options.scripts || [];
  const testScripts = project.architect.test.options.scripts || [];
  const libPath = path.join('node_modules', lib);

  for (const scriptPath of config.scripts) {
    const libScriptPath = path.join(libPath, scriptPath);

    if (!buildScripts.includes(libScriptPath)) {
      buildScripts.push(libScriptPath);
    }

    if (!testScripts.includes(libScriptPath)) {
      testScripts.push(libScriptPath);
    }
  }

  project.architect.build.options.scripts = buildScripts;
  project.architect.test.options.scripts = testScripts;
  saveConfig(angularConfig);
}

function registerObject(
  lib: string,
  assets: Array<string | GlobRule>,
  rule: GlobRule
) {
  if (!isValidObjectRule(rule)) {
    log.warning(`skipping invalid object rule`);
    return;
  }

  const input = path.relative(
    process.cwd(),
    path.join(process.cwd(), 'node_modules', lib, rule.input)
  );

  const finalRule = { ...rule, input };

  if (!isRegisteredObject(assets, finalRule)) {
    assets.push(finalRule);
  }
}

function registerString(
  lib: string,
  assets: Array<string | GlobRule>,
  rule: string
) {
  if (rule && assets) {
    const input = path.relative(
      process.cwd(),
      path.join(process.cwd(), 'node_modules', lib, rule)
    );

    if (!isRegisteredString(assets, input)) {
      assets.push(input);
    }
  }
}

function isValidObjectRule(rule: GlobRule): boolean {
  if (rule && rule.glob && rule.input && rule.output) {
    return true;
  }
  return false;
}

function isRegisteredString(
  assets: Array<string | GlobRule>,
  rule: string
): boolean {
  const stringRules = assets.filter(entry => typeof entry === 'string');
  return stringRules.includes(rule);
}

function isRegisteredObject(
  assets: Array<string | GlobRule>,
  rule: GlobRule
): boolean {
  const objectRules = assets
    .filter(entry => typeof entry === 'object')
    .map(entry => entry as GlobRule);

  return objectRules.some(existing => {
    return (
      existing.glob === rule.glob &&
      existing.input === rule.input &&
      existing.output === rule.output
    );
  });
}

/*
export function copyAssets(lib: string, config: Configuration): void {
  if (config && config.assets && config.assets.length > 0) {
    const libPath = path.join(process.cwd(), 'node_modules', lib);
    const localPath = path.join(process.cwd(), 'src/assets');

    sh.mkdir('-p', localPath);

    config.assets.forEach(asset => {
      const from = path.join(libPath, asset.from);
      const to = path.join(localPath, asset.to || '');

      sh.mkdir('-p', to);

      console.log(chalk.blue('info'), `copy ${asset.from}`);
      sh.cp(from, to);
    });
  }
}
*/
