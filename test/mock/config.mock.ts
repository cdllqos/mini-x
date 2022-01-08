import * as config from '@src/config';

export const mockGetConfig = (c: config.Config) => {
  jest.spyOn(config, 'getConfig').mockReturnValue(c);
};
