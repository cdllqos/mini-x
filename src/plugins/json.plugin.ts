import { copyLib, getStaticTarget } from '@src/utils/fname.util';
import { hasCopiedLib, setCopiedLib } from '@src/state/js.state';

import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { buildClientFileExtMatcher } from '@src/utils/plugin.util';
import { fsUtil } from '@src/utils/file.util';

export class JsonPlugin extends BasePlugin {
  matcher = buildClientFileExtMatcher(WorkspaceFile.json);

  onFileChange(fname: string, watcher: Watcher): void {
    const target = getStaticTarget(fname);
    fsUtil.copySync(fname, target);
    try {
      this.analysisJson(fname, watcher);
    } catch (error) {
      console.log('error: ', error);
    }
  }

  private analysisJson(fname: string, watcher: Watcher) {
    const { usingComponents } = fsUtil.readJsonSync(fname) as {
      usingComponents: { [k: string]: string };
    };

    if (!usingComponents) {
      return;
    }

    const paths = Object.values(usingComponents);
    paths.forEach((p) => {
      if (p.startsWith('.')) {
        return;
      }

      const splits = p.split('/');
      const packageName = splits[0];
      if (hasCopiedLib(packageName)) {
        return true;
      }

      copyLib(packageName);
      setCopiedLib(packageName);
    });
  }
}
