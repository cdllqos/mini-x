import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { buildFileExtMatcher } from '@src/utils/plugin.util';
import { fsUtil } from '@src/utils/file.util';
import { getConfig } from '@src/config';
import { getTranspileContent } from '@src/utils/compiler.util';

export class TsPlugin extends BasePlugin {
  matcher = buildFileExtMatcher(WorkspaceFile.ts);

  onFileChange(fname: string, watcher: Watcher): void {
    const tsContent = getTranspileContent(fname);
    const { miniprogramRoot, miniprogramTarget } = getConfig();
    const target = fname
      .replace(miniprogramRoot, miniprogramTarget)
      .replace('.ts', '.js');
    fsUtil.outputFileSync(target, tsContent);
    watcher.fileChange(target);
  }
}
