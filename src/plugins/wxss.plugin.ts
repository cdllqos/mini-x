import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { fsUtil } from '@src/utils/file.util';
import { getStaticTarget } from '@src/utils/fname.util';
import { pathProxy } from '@src/utils/path.util';

export class WxssPlugin extends BasePlugin {
  matcher(fname: string) {
    const fileExt = pathProxy.extname(fname).replace('.', '');
    return WorkspaceFile[fileExt] === WorkspaceFile.wxss;
  }

  onFileChange(fname: string, _: Watcher): void {
    const target = getStaticTarget(fname);
    fsUtil.copySync(fname, target);
  }
}
