import { BasePlugin } from '@src/plugins/base.plugin';
import { Watcher } from './watcher';

type Ctr = new () => BasePlugin;

export class MiniXCore {
  private plugins: BasePlugin[] = [];
  private watcher: Watcher;

  bootstrap() {
    this.watcher = new Watcher();
    this.watcher.fileChange$.subscribe((fname) => {
      this.plugins.forEach((plugin) => {
        if (plugin.matcher(fname)) {
          plugin.onFileChange(fname, this.watcher);
        }
      });
    });
  }

  registerPlugin(plugin: BasePlugin | Ctr) {
    if (plugin instanceof BasePlugin) {
      this.plugins.push(plugin);
      return;
    }
    this.plugins.push(new plugin());
  }
}
