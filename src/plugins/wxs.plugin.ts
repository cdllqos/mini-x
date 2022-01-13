import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { buildFileExtMatcher } from '@src/utils/plugin.util';
import { fsUtil } from '@src/utils/file.util';
import { getStaticTarget } from '@src/utils/fname.util';

export class WxsPlugin extends BasePlugin {
  matcher = buildFileExtMatcher(WorkspaceFile.wxs);

  onFileChange(fname: string, _: Watcher): void {
    const target = getStaticTarget(fname);
    fsUtil.copySync(fname, target);
  }
}
