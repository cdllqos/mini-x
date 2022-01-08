import { BasePlugin } from '@src/plugins/base.plugin';
import { Watcher } from './watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { pathProxy } from '@src/utils/path.util';

export class MiniXCore {
  private plugins: BasePlugin[] = [];
  private watcher: Watcher;

  bootstrap() {
    this.watcher = new Watcher();
    this.watcher.fileChange$.subscribe((fname) => {
      this.plugins.forEach((plugin) => {
        const { handleExt } = plugin;
        const fileExt = pathProxy.extname(fname).replace('.', '');
        if (handleExt === WorkspaceFile[fileExt]) {
          plugin.onFileChange(fname, this.watcher);
        }
      });
    });
  }

  registerPlugin(plugin: BasePlugin) {
    this.plugins.push(plugin);
  }
}
