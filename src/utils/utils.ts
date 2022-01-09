import { MiniProgramInfo } from '@src/models';
import { NODE_MODULES } from '@src/constrants';
import { pathProxy } from './path.util';

export const getMiniProgramInfo = (path: string): MiniProgramInfo => {
  const splits = path
    .replace(pathProxy.resolve(NODE_MODULES) + '/', '')
    .split('/');
  const packageName = splits.shift();
  const packageJsonPath = pathProxy.resolve(
    NODE_MODULES,
    packageName,
    'package.json',
  );
  const { miniprogram } = require(packageJsonPath);

  if (!miniprogram) {
    throw new Error(`${packageName} is not miniprogram lib`);
  }

  return {
    packageName,
    miniprogram,
  };
};
