import { pathProxy, unixPath } from '@src/utils/path.util';

import { NODE_MODULES } from '@src/constrants';
import { getMiniProgramInfo } from '@src/utils/utils';

describe('test utils file', () => {
  it('test getMiniProgramInfo method', () => {
    const r = getMiniProgramInfo(
      pathProxy.resolve(NODE_MODULES, 'tdesign-miniprogram', 'test-path'),
    );
    const expected = {
      packageName: 'tdesign-miniprogram',
      miniprogram: 'miniprogram_dist',
    };
    expect(r).toEqual(expected);
  });
});
