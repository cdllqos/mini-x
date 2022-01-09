#!/usr/bin/env node

import { MiniXCore } from './core/core';
import { TsPlugin } from './plugins/ts.plugin';
import { WxssPlugin } from './plugins/wxss.plugin';

const main = () => {
  const core = new MiniXCore();

  core.registerPlugin(WxssPlugin);
  core.registerPlugin(TsPlugin);
  core.bootstrap();
  process.stdin.resume();
};
main();
