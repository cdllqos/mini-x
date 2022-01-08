#!/usr/bin/env node

import { MiniXCore } from './core/core';

const main = () => {
  const core = new MiniXCore();
  core.bootstrap();
  process.stdin.resume();
};
main();
