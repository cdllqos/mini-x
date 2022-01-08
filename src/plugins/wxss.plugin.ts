import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';

export class WxssPlugin extends BasePlugin {
  handleExt: WorkspaceFile = WorkspaceFile.wxss;
  onFileChange(fname: string, watcher: Watcher): void {
    // TODO: should copy file
  }
}
