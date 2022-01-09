import { Watcher } from '@src/core/watcher';

export abstract class BasePlugin {
  abstract matcher(fname: string): boolean;
  abstract onFileChange(fname: string, watcher: Watcher): void;
}
