import { Subject, debounceTime } from 'rxjs';

import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { compile } from 'sass';
import { fsUtil } from '@src/utils/file.util';
import { getStaticTarget } from '@src/utils/fname.util';

const sassFiles: string[] = [];

export class SassPlugin extends BasePlugin {
  private compileChange$$ = new Subject<void>();
  private compileChange$ = this.compileChange$$.asObservable();

  constructor() {
    super();
    this.compileChange$.pipe(debounceTime(100)).subscribe(() => {
      this.compile();
    });
  }

  matcher(fname: string): boolean {
    return fname.includes(WorkspaceFile.scss);
  }

  onFileChange(fname: string, _: Watcher): void {
    sassFiles.push(fname);
    this.compileChange$$.next();
  }

  private compile() {
    sassFiles.forEach((fname) => {
      if (!fsUtil.existsSync(fname)) {
        return;
      }

      try {
        const r = compile(fname, { sourceMap: false });
        const target = getStaticTarget(fname).replace('.scss', '.wxss');
        fsUtil.outputFile(target, r.css);
      } catch (error) {
        console.log('error: ', error);
      }
    });
  }
}
