import { addJsImport, getJsImports } from '@src/state/js.state';

describe('test jsState file', () => {
  it('test unixPath method', () => {
    addJsImport('rxjs', ['map', 'filter']);
    const set = getJsImports('rxjs');
    expect(set).toEqual(new Set(['map', 'filter']));
  });
});
