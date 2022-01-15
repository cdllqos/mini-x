import * as fs from 'fs-extra';

import { PROJECT_CONFIG } from '@src/constrants';
import { pathProxy } from '@src/utils/path.util';

export interface Config {
  miniprogramRoot: string;
  cloudfunctionRoot: string;
  dist: string;
  miniprogramTarget: string;
  cloudFunctionTarget: string;
}

let config: Config;

export const getConfig = (): Readonly<Config> => {
  if (config) {
    return config;
  }

  try {
    const { miniprogramRoot, cloudfunctionRoot = '' } = fs.readJSONSync(
      PROJECT_CONFIG,
    ) as {
      miniprogramRoot: string;
      cloudfunctionRoot: string;
    };

    config = {
      miniprogramRoot: pathProxy.resolve(miniprogramRoot),
      cloudfunctionRoot: pathProxy.resolve(cloudfunctionRoot),
      dist: pathProxy.resolve('dist'),
      miniprogramTarget: pathProxy.resolve('dist', miniprogramRoot),
      cloudFunctionTarget: pathProxy.resolve('dist', cloudfunctionRoot),
    };
  } catch (error) {
    const errMsg = `make sure ${PROJECT_CONFIG} file exist`;
    throw new Error(errMsg);
  }

  return config;
};
