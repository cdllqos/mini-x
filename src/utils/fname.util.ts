import { MINI_PROGRAM_NPM, NODE_MODULES } from '@src/constrants';

import { getConfig } from '@src/config';
import { getMiniProgramInfo } from './utils';
import { pathProxy } from './path.util';

export const getStaticTarget = (fname: string) => {
  const { miniprogramRoot, miniprogramTarget } = getConfig();
  if (!fname.includes(NODE_MODULES)) {
    return fname.replaceAll(miniprogramRoot, miniprogramTarget);
  }

  const relativePath = getRelativePath(fname);
  const { packageName } = getMiniProgramInfo(fname);
  return pathProxy.resolve(
    miniprogramTarget,
    MINI_PROGRAM_NPM,
    packageName,
    relativePath,
  );
};

export const getRelativePath = (fname: string) => {
  if (!fname.includes(NODE_MODULES)) {
    throw new Error(`expect fname includes ${NODE_MODULES}`);
  }
  const { miniprogram, packageName } = getMiniProgramInfo(fname);
  const basePath =
    pathProxy.resolve(NODE_MODULES, packageName, miniprogram) + '/';
  return fname.replace(basePath, '');
};
