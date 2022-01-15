import * as chokidar from 'chokidar';

import { PROJECT_CONFIG, WATCH_FILE_EXTS } from '@src/constrants';
import { pathProxy, unixPath } from '@src/utils/path.util';

import { CopyDir } from '@src/enum/workspace-file';
import { Subject } from 'rxjs';
import { fsUtil } from '@src/utils/file.util';
import { getConfig } from '@src/config';

export class Watcher {
  private fileChange$$ = new Subject<string>();
  fileChange$ = this.fileChange$$.asObservable();

  constructor() {
    this.init();
  }

  private init() {
    const { miniprogramRoot, cloudfunctionRoot, dist } = getConfig();
    fsUtil.copySync(
      PROJECT_CONFIG,
      PROJECT_CONFIG.replace(pathProxy.resolve(), dist),
    );

    const staticDirs = [CopyDir.assets].map((dir) => {
      return `${miniprogramRoot}/**/${dir}/**/*.*`;
    });
    const watchFiles = WATCH_FILE_EXTS.map((fileExt) => {
      return `${miniprogramRoot}/**/*.${fileExt}`;
    });
    const cloudFunctions = `${cloudfunctionRoot}/**/*.*`;

    const watcher = chokidar.watch(
      [...watchFiles, ...staticDirs, cloudFunctions],
      {
        ignored: ['**/node_modules', '**/.mini-x', '**/*.d.ts'],
      },
    );
    const changeCallback = (f) => {
      this.fileChange$$.next(unixPath(f));
    };
    watcher.on('add', changeCallback).on('change', changeCallback);
  }

  fileChange(fname: string) {
    this.fileChange$$.next(unixPath(fname));
  }
}
