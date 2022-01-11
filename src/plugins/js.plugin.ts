import { MINI_PROGRAM_NPM, MINI_X_TEMP, NODE_MODULES } from '@src/constrants';
import { addJsImport, getJsImports } from '@src/state/js.state';
import {
  getExportContent,
  getLibImportedtFiles,
  getLibTarget,
  getThirdImports,
} from '@src/utils/compiler.util';

import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { fsUtil } from '@src/utils/file.util';
import { getConfig } from '@src/config';
import { pathProxy } from '@src/utils/path.util';

export class JsPlugin extends BasePlugin {
  matcher(fname: string): boolean {
    const fileExt = pathProxy.extname(fname).replace('.', '');
    return WorkspaceFile[fileExt] === WorkspaceFile.js;
  }

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
      const fileName = packageName.includes('/')
        ? packageName + '.js'
        : packageName + '/index.js';

      const target = pathProxy.resolve(
        getConfig().miniprogramRoot,
        MINI_X_TEMP,
        fileName,
      );
      const content = getExportContent(packageName, getJsImports(packageName));
      fsUtil.outputFile(target, content);
      // TODO: esbuild
    });
  }
}
