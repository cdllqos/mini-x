import { BasePlugin } from './base.plugin';
import { Watcher } from '@src/core/watcher';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { buildFileExtMatcher } from '@src/utils/plugin.util';
import { fsUtil } from '@src/utils/file.util';
import { getStaticTarget } from '@src/utils/fname.util';
import parse from 'node-html-parser';
import { pathProxy } from '@src/utils/path.util';

export class WxmlPlugin extends BasePlugin {
  matcher = buildFileExtMatcher(WorkspaceFile.wxml);

  onFileChange(fname: string, watcher: Watcher): void {
    const target = getStaticTarget(fname);
    fsUtil.copySync(fname, target);
    this.handleWxs(fname, watcher);
  }

  private handleWxs(fname: string, watcher: Watcher) {
    const content = fsUtil.readFileSync(fname);
    const root = parse(content.toString());
    const wxsTags = root.querySelectorAll('wxs');
    wxsTags.forEach((node) => {
      const src = node.getAttribute('src');
      if (!src) {
        throw new Error(`cant't find src in this node: ${node.outerHTML}`);
      }
      const wxsPath = pathProxy.resolve(pathProxy.dirname(fname), src);
      watcher.fileChange(wxsPath);
    });
  }
}
