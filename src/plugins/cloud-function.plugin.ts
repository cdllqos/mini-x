import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { fsUtil } from '@src/utils/file.util';
import { getConfig } from '@src/config';
import { pathProxy } from '@src/utils/path.util';

export class CloudFunctionPlugin extends BasePlugin {
  matcher(fname: string): boolean {
    return fname.includes(getConfig().cloudfunctionRoot);
  }

  onFileChange(fname: string, watcher: Watcher): void {
    const target = fname.replace(pathProxy.resolve(), getConfig().dist);
    fsUtil.copySync(fname, target);
  }
}
