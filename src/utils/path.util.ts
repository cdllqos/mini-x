import * as path from 'path';

import { unixPath } from './utils';

export const pathProxy = new Proxy(path, {
  get: function (target: path.PlatformPath, key: string) {
    const originFn = target[key] as Function;
    if (typeof originFn !== 'function') {
      return originFn;
    }

    const newFn = function (...args) {
      const r = originFn.call(this, ...args);
      if (typeof r !== 'string') {
        return r;
      }
      return unixPath(r);
    };
    return newFn;
  },
});
