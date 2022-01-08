import { WorkspaceFile } from '@src/enum/workspace-file';
import { pathProxy } from '@src/utils/path.util';

export const WATCH_FILE_EXTS = [
  WorkspaceFile.json,
  WorkspaceFile.less,
  WorkspaceFile.scss,
  WorkspaceFile.ts,
  WorkspaceFile.wxml,
  WorkspaceFile.wxss,
];

export const PROJECT_CONFIG = pathProxy.resolve('./project.config.json');
export const MINI_PROGRAM_NPM = 'miniprogram_npm';
