import { BasePlugin } from './base.plugin';
import { NODE_MODULES } from '@src/constrants';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { buildFileExtMatcher } from '@src/utils/plugin.util';
import { fsUtil } from '@src/utils/file.util';
import { getStaticTarget } from '@src/utils/fname.util';
import { pathProxy } from '@src/utils/path.util';

export class JsonPlugin extends BasePlugin {
  matcher = buildFileExtMatcher(WorkspaceFile.json);

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
        if (fname.includes(NODE_MODULES)) {
          const basePath = pathProxy.resolve(pathProxy.dirname(fname), p);
          this.componentChange(basePath, watcher);
        }
        return;
      }

      const splits = p.split('/');
      const packageName = splits[0];
      const packageJsonPath = pathProxy.resolve(
        NODE_MODULES,
        packageName,
        'package.json',
      );
      const { miniprogram } = require(packageJsonPath) as {
        miniprogram: string;
      };

      if (!miniprogram) {
        throw new Error(`can't find miniprogram is path:`);
      }

      splits.splice(1, 0, miniprogram);
      const relativePath = splits.join('/');
      const basePath = pathProxy.resolve(NODE_MODULES, relativePath);
      this.componentChange(basePath, watcher);
    });
  }

  private componentChange(basePath: string, watcher: Watcher) {
    const fileTypes = [
      WorkspaceFile.js,
      WorkspaceFile.json,
      WorkspaceFile.wxml,
      WorkspaceFile.wxss,
    ];
    fileTypes.forEach((fileExt) => {
      const filePath = `${basePath}.${fileExt}`;
      watcher.fileChange(filePath);
    });
  }
}
