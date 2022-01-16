import { MINI_PROGRAM_NPM, MINI_X_TEMP, NODE_MODULES } from '@src/constrants';
import { addJsImport, getJsImports } from '@src/state/js.state';
import {
  getExportContent,
  getLibImportedtFiles,
  getLibTarget,
  getThirdImports,
  packThirdLib,
} from '@src/utils/compiler.util';

import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { buildClientFileExtMatcher } from '@src/utils/plugin.util';
import { fsUtil } from '@src/utils/file.util';
import { getConfig } from '@src/config';
import { pathProxy } from '@src/utils/path.util';

export class JsPlugin extends BasePlugin {
  matcher = buildClientFileExtMatcher(WorkspaceFile.js);

  onFileChange(fname: string, watcher: Watcher): void {
    if (!fname.includes(NODE_MODULES)) {
      this.bundleLib(fname, watcher);
      return;
    }

    const target = getLibTarget(fname);
    fsUtil.copySync(fname, target);
    const imports = getLibImportedtFiles(fname);
    imports.forEach((f) => {
      watcher.fileChange(f);
    });
  }

  private bundleLib(fname: string, watcher: Watcher) {
    const thirdImports = getThirdImports(fname);
    thirdImports.forEach(({ packageName, identifiers }) => {
      addJsImport(packageName, identifiers);
    });
    new Set(thirdImports.map((m) => m.packageName)).forEach((packageName) => {
      if (this.jsComponentImport(packageName, watcher)) {
        return;
      }
      const fileName = packageName.includes('/')
        ? packageName + '.js'
        : packageName + '/index.js';
      const { miniprogramRoot, miniprogramTarget } = getConfig();
      const libPath = pathProxy.resolve(miniprogramRoot, MINI_X_TEMP, fileName);
      const content = getExportContent(packageName, getJsImports(packageName));
      const packageDir = packageName.split('/')[0];
      const outDir = pathProxy.resolve(
        miniprogramTarget,
        MINI_PROGRAM_NPM,
        packageDir,
      );
      fsUtil.outputFileSync(libPath, content);
      packThirdLib(libPath, outDir);
    });
  }
  private jsComponentImport(path: string, watcher: Watcher) {
    const splits = path.split('/');
    const packageName = splits[0];
    const packageJsonPath = pathProxy.resolve(
      NODE_MODULES,
      packageName,
      'package.json',
    );
    if (!fsUtil.existsSync(packageJsonPath)) {
      return false;
    }
    const { miniprogram } = require(packageJsonPath) as {
      miniprogram: string;
    };
    if (!miniprogram) {
      return false;
    }

    splits.splice(1, 0, miniprogram);
    const relativePath = splits.join('/');
    const basePath = pathProxy.resolve(NODE_MODULES, relativePath);
    watcher.fileChange(`${basePath}.js`);
    return true;
  }
}
