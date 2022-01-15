import { WorkspaceFile } from '@src/enum/workspace-file';
import { getConfig } from '@src/config';
import { pathProxy } from '@src/utils/path.util';

export const buildClientFileExtMatcher = (workspaceFile: WorkspaceFile) => {
  return (fname: string): boolean => {
    const fileExt = pathProxy.extname(fname).replace('.', '');
    const { miniprogramRoot } = getConfig();
    return (
      fname.includes(miniprogramRoot) &&
      WorkspaceFile[fileExt] === workspaceFile
    );
  };
};
