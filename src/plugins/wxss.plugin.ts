import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { buildClientFileExtMatcher } from '@src/utils/plugin.util';
import { fsUtil } from '@src/utils/file.util';
import { getStaticTarget } from '@src/utils/fname.util';

export class WxssPlugin extends BasePlugin {
  matcher = buildClientFileExtMatcher(WorkspaceFile.wxss);

  onFileChange(fname: string, _: Watcher): void {
    const target = getStaticTarget(fname);
    fsUtil.copySync(fname, target);
  }
}
