const fs = require('fs-extra');
const path = require('path');

const main = () => {
  fs.removeSync(path.resolve(__dirname, '../dist'));
  const packageContent = require(path.resolve(__dirname, '../package.json'));

  packageContent.bin = {
    'mini-x': 'main.js',
  };

  fs.outputJSONSync(
    path.resolve(__dirname, '../dist/package.json'),
    packageContent,
  );
};

main();
