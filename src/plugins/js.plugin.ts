import { getLibImportedtFiles, getLibTarget } from '@src/utils/compiler.util';

import { BasePlugin } from './base.plugin';
import { NODE_MODULES } from '@src/constrants';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { fsUtil } from '@src/utils/file.util';
import { pathProxy } from '@src/utils/path.util';

export class JsPlugin extends BasePlugin {
  matcher(fname: string): boolean {
    const fileExt = pathProxy.extname(fname).replace('.', '');
    return WorkspaceFile[fileExt] === WorkspaceFile.js;
  }

  onFileChange(fname: string, watcher: Watcher): void {
    if (!fname.includes(NODE_MODULES)) {
      // TODO: check import third lib
      return;
    }

    const target = getLibTarget(fname);
    fsUtil.copySync(fname, target);
    const imports = getLibImportedtFiles(fname);
    imports.forEach((f) => {
      watcher.fileChange(f);
    });
  }
}
