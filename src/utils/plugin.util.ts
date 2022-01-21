import { NODE_MODULES } from '@src/constrants';
import { WorkspaceFile } from '@src/enum/workspace-file';
import { getConfig } from '@src/config';
import { pathProxy } from '@src/utils/path.util';

export const buildClientFileExtMatcher = (workspaceFile: WorkspaceFile) => {
  return (fname: string): boolean => {
    const fileExt = pathProxy.extname(fname).replace('.', '');
    const { miniprogramRoot, miniprogramTarget } = getConfig();
    return (
      (fname.includes(miniprogramRoot) ||
        fname.includes(miniprogramTarget) ||
        fname.includes(NODE_MODULES)) &&
      WorkspaceFile[fileExt] === workspaceFile
    );
  };
};
