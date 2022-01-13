#!/usr/bin/env node

import { JsPlugin } from './plugins/js.plugin';
import { JsonPlugin } from './plugins/json.plugin';
import { MiniXCore } from './core/core';
import { TsPlugin } from './plugins/ts.plugin';
import { WxmlPlugin } from './plugins/wxml.plugin';
import { WxsPlugin } from './plugins/wxs.plugin';
import { WxssPlugin } from './plugins/wxss.plugin';

const main = () => {
  const core = new MiniXCore();

  core.registerPlugin(WxssPlugin);
  core.registerPlugin(TsPlugin);
  core.registerPlugin(JsPlugin);
  core.registerPlugin(WxmlPlugin);
  core.registerPlugin(JsonPlugin);
  core.registerPlugin(WxsPlugin);
  core.bootstrap();
  process.stdin.resume();
};
main();
