const fs = require('fs-extra');
const path = require('path');

const main = () => {
  fs.removeSync(path.resolve('dist'));
  const packageContent = require(path.resolve('package.json'));
  packageContent.bin = {
    'mini-x': 'main.js',
  };
  fs.copySync(path.resolve('README.md'), 'dist/README.md');
  fs.outputJSONSync(path.resolve('dist/package.json'), packageContent);
};

main();
