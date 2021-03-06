import { getStaticTarget } from '@src/utils/fname.util';
import { mockGetConfig } from '@test/mock/config.mock';
import { pathProxy } from '@src/utils/path.util';

describe('test fname util', () => {
  beforeAll(() => {
    mockGetConfig({
      miniprogramRoot: pathProxy.resolve('src'),
      cloudfunctionRoot: pathProxy.resolve('cloudFunction'),
      dist: pathProxy.resolve('dist'),
      miniprogramTarget: pathProxy.resolve('dist', 'miniprogram'),
      cloudFunctionTarget: pathProxy.resolve('dist', 'cloudFunction'),
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('test getStaticTarget method', () => {
    const r = getStaticTarget(pathProxy.resolve('src/page/index/index.wxss'));
    const expected = 'miniprogram/page/index/index.wxss';
    expect(r.includes(expected)).toEqual(true);
  });
});
