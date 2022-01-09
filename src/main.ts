#!/usr/bin/env node

import { JsPlugin } from './plugins/js.plugin';
import { MiniXCore } from './core/core';
import { TsPlugin } from './plugins/ts.plugin';
import { WxssPlugin } from './plugins/wxss.plugin';

const main = () => {
  const core = new MiniXCore();

  core.registerPlugin(WxssPlugin);
  core.registerPlugin(TsPlugin);
  core.registerPlugin(JsPlugin);
  core.bootstrap();
  process.stdin.resume();
};
main();
