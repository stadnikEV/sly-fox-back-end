const fs = require('fs');

const removeFile = ({ path }) => {
  return new Promise((resolve) => {
    fs.readFile(path, (err) => {
      if (err) {
        resolve();
        return;
      }
      fs.unlinkSync(path);
      resolve();
    });
  });
};

module.exports = removeFile;
