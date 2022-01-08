#!/usr/bin/env node

import { MiniXCore } from './core/core';
import { WxssPlugin } from './plugins/wxss.plugin';

const main = () => {
  const core = new MiniXCore();

  core.registerPlugin(WxssPlugin);
  core.bootstrap();
  process.stdin.resume();
};
main();
