const fs = require('fs-extra');
const path = require('path');

const main = () => {
  fs.removeSync(path.resolve('dist'));
};

main();
