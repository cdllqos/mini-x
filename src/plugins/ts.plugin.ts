import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { fsUtil } from '@src/utils/file.util';
import { getConfig } from '@src/config';
import { getTranspileContent } from '@src/utils/compiler.util';
import { pathProxy } from '@src/utils/path.util';

export class TsPlugin extends BasePlugin {
  matcher(fname: string): boolean {
    const fileExt = pathProxy.extname(fname).replace('.', '');
    return WorkspaceFile[fileExt] === WorkspaceFile.ts;
  }

  onFileChange(fname: string, watcher: Watcher): void {
    const tsContent = getTranspileContent(fname);
    const { miniprogramRoot, dist } = getConfig();
    const target = fname.replace(miniprogramRoot, dist).replace('.ts', '.js');
    fsUtil.outputFileSync(target, tsContent);
    watcher.fileChange(target);
  }
}
