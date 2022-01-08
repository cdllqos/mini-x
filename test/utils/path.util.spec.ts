import { pathProxy } from '@src/utils/path.util';

describe('test pathUtil file', () => {
  it('test resolve method', () => {
    const r = pathProxy.resolve();
    expect(r.includes('\\')).toEqual(false);
  });

  it('test absolute method', () => {
    const r = pathProxy.isAbsolute(pathProxy.resolve());
    expect(r).toEqual(true);
  });
});
