import { WorkspaceFile } from '@src/enum/workspace-file';
import { pathProxy } from '@src/utils/path.util';

export const buildFileExtMatcher = (workspaceFile: WorkspaceFile) => {
  return (fname: string): boolean => {
    const fileExt = pathProxy.extname(fname).replace('.', '');
    return WorkspaceFile[fileExt] === workspaceFile;
  };
};
