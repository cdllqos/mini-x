import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { fsUtil } from '@src/utils/file.util';
import { getConfig } from '@src/config';
import { pathProxy } from '@src/utils/path.util';
import { transformFileSync } from '@swc/core';

export class CloudFunctionPlugin extends BasePlugin {
  matcher(fname: string): boolean {
    return fname.includes(getConfig().cloudfunctionRoot);
  }

  onFileChange(fname: string, watcher: Watcher): void {
    const target = fname.replace(pathProxy.resolve(), getConfig().dist);
    if (!fname.includes('.ts')) {
      fsUtil.copySync(fname, target);
      return;
    }

    const output = transformFileSync(fname, {
      sourceMaps: true,
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: false,
        },
      },
      module: {
        type: 'commonjs',
      },
    });
    fsUtil.outputFile(target.replace('.ts', '.js'), output.code);
  }
}
