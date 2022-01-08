import { getConfig } from '@src/config';

export const getStaticTarget = (fname: string) => {
  const { miniprogramRoot, dist } = getConfig();
  return fname.replaceAll(miniprogramRoot, dist);
};
