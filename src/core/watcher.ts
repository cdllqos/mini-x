import * as chokidar from 'chokidar';

import { CopyDir } from '@src/enum/workspace-file';
import { Subject } from 'rxjs';
import { WATCH_FILE_EXTS } from '@src/constrants';
import { getConfig } from '@src/config';
import { unixPath } from '@src/utils/utils';

export class Watcher {
  private fileChange$$ = new Subject<string>();
  fileChange$ = this.fileChange$$.asObservable();

  constructor() {
    this.init();
  }

  private init() {
    const { miniprogramRoot } = getConfig();

    const staticDirs = [CopyDir.assets].map((dir) => {
      return `${miniprogramRoot}/**/${dir}/**/*.*`;
    });
    const watchFiles = WATCH_FILE_EXTS.map((fileExt) => {
      return `${miniprogramRoot}/**/*.${fileExt}`;
    });

    const watcher = chokidar.watch([...watchFiles, ...staticDirs], {
      ignored: ['**/node_modules', '**/.mini-x', '**/*.d.ts'],
    });
    const changeCallback = (f) => {
      this.fileChange$$.next(unixPath(f));
    };
    watcher.on('add', changeCallback).on('change', changeCallback);
  }

  fileChange(fname: string) {
    this.fileChange$$.next(unixPath(fname));
  }
}
