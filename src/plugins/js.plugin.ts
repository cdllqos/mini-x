import { MINI_PROGRAM_NPM, MINI_X_TEMP, NODE_MODULES } from '@src/constrants';
import {
  addJsImport,
  getJsImports,
  hasCopiedLib,
  setCopiedLib,
} from '@src/state/js.state';
import {
  getExportContent,
  getThirdImports,
  packThirdLib,
} from '@src/utils/compiler.util';

import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { buildFileExtMatcher } from '@src/utils/plugin.util';
import { copyLib } from '@src/utils/fname.util';
import { fsUtil } from '@src/utils/file.util';
import { getConfig } from '@src/config';
import { pathProxy } from '@src/utils/path.util';

export class JsPlugin extends BasePlugin {
  matcher = buildFileExtMatcher(WorkspaceFile.js);

  onFileChange(fname: string, watcher: Watcher): void {
    if (fname.includes(NODE_MODULES)) {
      throw new Error(
        `can't get static target when fanme includes ${NODE_MODULES}, fname is:${fname}`,
      );
    }
    this.bundleLib(fname, watcher);
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
      const { miniprogramRoot, dist } = getConfig();
      const libPath = pathProxy.resolve(miniprogramRoot, MINI_X_TEMP, fileName);
      const content = getExportContent(packageName, getJsImports(packageName));
      const packageDir = packageName.split('/')[0];
      const outDir = pathProxy.resolve(dist, MINI_PROGRAM_NPM, packageDir);

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

    if (hasCopiedLib(packageName)) {
      return true;
    }

    copyLib(packageName);
    setCopiedLib(packageName);

    return true;
  }
}
