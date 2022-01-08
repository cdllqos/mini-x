import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';

export abstract class BasePlugin {
  abstract handleExt: WorkspaceFile;
  abstract onFileChange(fname: string, watcher: Watcher): void;
}
