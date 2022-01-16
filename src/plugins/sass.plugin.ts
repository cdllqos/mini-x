import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { compile } from 'sass';
import { fsUtil } from '@src/utils/file.util';
import { getStaticTarget } from '@src/utils/fname.util';

export class SassPlugin extends BasePlugin {
  matcher(fname: string): boolean {
    return fname.includes(WorkspaceFile.scss);
  }

  onFileChange(fname: string, _: Watcher): void {
    const r = compile(fname, { sourceMap: false });
    const target = getStaticTarget(fname).replace('.scss', '.wxss');
    fsUtil.outputFile(target, r.css);
  }
}
