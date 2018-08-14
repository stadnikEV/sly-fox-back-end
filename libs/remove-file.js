const fs = require('fs');

const removeFile = ({ path }) => {
  return new Promise((resolve) => {
    fs.readFile(path, (err) => {
      if (err) {
        console.log('not remove');
        resolve();
        return;
      }
      console.log('remove');
      fs.unlinkSync(path);
      resolve();  
    });
  });
};

module.exports = removeFile;
