#!/usr/bin/env node

import { AssetsPlugin } from './plugins/assets.plugin';
import { CloudFunctionPlugin } from './plugins/cloud-function.plugin';
import { JsPlugin } from './plugins/js.plugin';
import { JsonPlugin } from './plugins/json.plugin';
import { MiniXCore } from './core/core';
import { SassPlugin } from './plugins/sass.plugin';
import { TsPlugin } from './plugins/ts.plugin';
import { WxmlPlugin } from './plugins/wxml.plugin';
import { WxsPlugin } from './plugins/wxs.plugin';
import { WxssPlugin } from './plugins/wxss.plugin';

const main = () => {
  const core = new MiniXCore();
  const plugins = [
    WxssPlugin,
    TsPlugin,
    JsPlugin,
    WxmlPlugin,
    JsonPlugin,
    WxsPlugin,
    CloudFunctionPlugin,
    SassPlugin,
    AssetsPlugin,
  ];

  plugins.forEach((plugin) => {
    core.registerPlugin(plugin);
  });

  core.bootstrap();
  process.stdin.resume();
};
main();
