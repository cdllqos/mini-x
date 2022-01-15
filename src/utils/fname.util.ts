import { MINI_PROGRAM_NPM, NODE_MODULES } from '@src/constrants';

import { fsUtil } from './file.util';
import { getConfig } from '@src/config';
import { getMiniProgramInfo } from './utils';
import { pathProxy } from './path.util';

export const getStaticTarget = (fname: string) => {
  const { miniprogramRoot, miniprogramTarget } = getConfig();
  if (fname.includes(NODE_MODULES)) {
    throw new Error(
      `can't get static target when fanme includes ${NODE_MODULES}, fname is:${fname}`,
    );
  }

  return fname.replaceAll(miniprogramRoot, miniprogramTarget);
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

export const copyLib = (packageName) => {
  const dirPath = pathProxy.resolve(NODE_MODULES, packageName);
  if (!fsUtil.existsSync(dirPath)) {
    throw new Error(`can't find "${packageName}" package`);
  }

  const { miniprogram } = require(pathProxy.resolve(dirPath, 'package.json'));

  if (!miniprogram) {
    throw new Error(`${packageName} is not miniprogram lib`);
  }

  const { miniprogramTarget } = getConfig();
  fsUtil.copySync(
    `${dirPath}/${miniprogram}`,
    pathProxy.resolve(miniprogramTarget, MINI_PROGRAM_NPM, packageName),
  );
};
