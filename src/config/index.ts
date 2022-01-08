import * as fs from 'fs-extra';

import { PROJECT_CONFIG } from '@src/constrants';
import { pathProxy } from '@src/utils/path.util';

export interface Config {
  miniprogramRoot: string;
  dist: string;
}

let config: Config;

export const initConfig = () => {
  if (config) {
    return;
  }

  const projectConfig = fs.readJSONSync(PROJECT_CONFIG) as {
    miniprogramRoot: string;
  };

  config = {
    miniprogramRoot: pathProxy.resolve(projectConfig.miniprogramRoot),
    dist: pathProxy.resolve('dist'),
  };
};

export const getConfig = (): Readonly<Config> => {
  return config;
};
