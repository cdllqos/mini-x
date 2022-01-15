import { copyLib, getStaticTarget } from '@src/utils/fname.util';

import { mockGetConfig } from '@test/mock/config.mock';
import { pathProxy } from '@src/utils/path.util';

describe('test fname util', () => {
  beforeAll(() => {
    mockGetConfig({
      miniprogramRoot: pathProxy.resolve('src'),
      dist: pathProxy.resolve('dist'),
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('test getStaticTarget method', () => {
    const r = getStaticTarget(pathProxy.resolve('src/page/index/index.wxss'));
    const expected = 'dist/page/index/index.wxss';
    expect(r.includes(expected)).toEqual(true);
  });

  it('test copyLib method', () => {
    const r = copyLib('tdesign-miniprogram');
  });
});
