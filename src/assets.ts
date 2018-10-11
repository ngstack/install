import path from 'path';
import fs from 'fs';

import log from './log';
import AngularConfig from './angular-config';
import { Configuration, GlobRule } from './configuration';

export function registerAssets(lib: string, config: Configuration) {
  if (!config || !config.assets || config.assets.length === 0) {
    return;
  }

  log.info('registering assets');

  const configPath = path.join(process.cwd(), 'angular.json');
  let angularConfig: AngularConfig;

  try {
    angularConfig = require(configPath);
  } catch {
    log.warning('angular.json file not found.');
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

  fs.writeFileSync(configPath, JSON.stringify(angularConfig, null, 2));
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
