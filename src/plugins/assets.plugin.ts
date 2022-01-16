import { BasePlugin } from './base.plugin';
import { CopyDir } from '@src/enum/workspace-file';
import { Watcher } from '@src/core/watcher';
import { fsUtil } from '@src/utils/file.util';
import { getStaticTarget } from '@src/utils/fname.util';

export class AssetsPlugin extends BasePlugin {
  matcher(fname: string): boolean {
    return fname.includes(CopyDir.assets);
  }

  onFileChange(fname: string, _: Watcher): void {
    const target = getStaticTarget(fname);
    fsUtil.copySync(fname, target);
  }
}
