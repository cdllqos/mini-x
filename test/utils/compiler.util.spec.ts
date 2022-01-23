import {
  getExportContent,
  getLibImportedtFiles,
  getThirdImports,
  getTranspileContent,
} from '@src/utils/compiler.util';

import { NODE_MODULES } from '@src/constrants';
import { fsUtil } from '@src/utils/file.util';
import { pathProxy } from '@src/utils/path.util';

describe('test compiler util', () => {
  it('test compileTs method', () => {
    const fname = pathProxy.resolve(__dirname, 'compiler-test-file.ts');
    const expected = `import { map } from 'rxjs/operators';
const a = '';
console.log('a: ', a);
console.log('map: ', map);
`;
    const r = getTranspileContent(fname);
    expect(r).toEqual(expected);
  });

  it('test getImportedtFiles method', () => {
    const fname = pathProxy.resolve(
      'node_modules/tdesign-miniprogram/miniprogram_dist/date-time-picker/date-time-picker.js',
    );
    const expected = [
      'tdesign-miniprogram/miniprogram_dist/miniprogram_npm/dayjs/index.js',
      'tdesign-miniprogram/miniprogram_dist/common/src/index.js',
      'tdesign-miniprogram/miniprogram_dist/date-time-picker/locale/zh.js',
      'tdesign-miniprogram/miniprogram_dist/date-time-picker/props.js',
    ].map((p) => pathProxy.resolve(NODE_MODULES, p));
    const r = getLibImportedtFiles(fname);
    expect(r).toEqual(expected);
  });

  it('test getThirdImports method', () => {
    const fname = pathProxy.resolve(__dirname, 'compiler-test-file.ts');
    const r = getThirdImports(fname);
    const expected = [{ packageName: 'rxjs/operators', identifiers: ['map'] }];
    expect(r).toEqual(expected);
  });

  it('test getExportContent method', () => {
    const r = getExportContent('rxjs', new Set(['map', 'filter', 'debounce']));
    const expected = `import { map, filter, debounce } from 'rxjs';
export { map }
export { filter }
export { debounce }
`;
    expect(r).toEqual(expected);
  });
});
