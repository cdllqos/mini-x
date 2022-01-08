import * as fs from 'fs-extra';

import { PROJECT_CONFIG } from '@src/constrants';
import { pathProxy } from '@src/utils/path.util';

export interface Config {
  miniprogramRoot: string;
  dist: string;
}

let config: Config;

export const getConfig = (): Readonly<Config> => {
  if (config) {
    return config;
  }

  try {
    const projectConfig = fs.readJSONSync(PROJECT_CONFIG) as {
      miniprogramRoot: string;
    };
    config = {
      miniprogramRoot: pathProxy.resolve(projectConfig.miniprogramRoot),
      dist: pathProxy.resolve('dist'),
    };
  } catch (error) {
    const errMsg = `make sure ${PROJECT_CONFIG} file exist`;
    throw new Error(errMsg);
  }

  return config;
};
