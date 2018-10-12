import path from 'path';
import fs from 'fs';

import log from './log';
import { ModuleRef } from './configuration';
import TsUtils from './ts-utils';
import { format } from './utils';

export function parseModules(
  namespace: string,
  modules: Array<string>
): Array<ModuleRef> {
  return modules.filter(name => name).map(name => {
    return <ModuleRef>{
      namespace,
      name
    };
  });
}

export function registerModules(
  moduleName: string,
  modules: Array<ModuleRef>,
  skipFormat?: boolean
): void {
  if (!modules || modules.length === 0) {
    return;
  }

  log.info('registering modules');

  const modulePath = path.join(
    process.cwd(),
    'src/app',
    `${moduleName}.module.ts`
  );

  const source = fs.readFileSync(modulePath).toString();
  const tsUtils = new TsUtils();

  let sourceFile = tsUtils.parse(source);
  sourceFile = tsUtils.registerModules(sourceFile, modules);

  const output = tsUtils.renderFile(sourceFile);
  fs.writeFileSync(modulePath, skipFormat ? output : format(output));
}
