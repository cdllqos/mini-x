import * as path from 'path';

import { unixPath } from '@src/utils/utils';

describe('test utils file', () => {
  it('test unixPath method', () => {
    const r = unixPath(path.resolve());
    expect(r.includes('\\')).toEqual(false);
  });
});
