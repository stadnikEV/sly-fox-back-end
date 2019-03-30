const fs = require('fs');

module.exports = ({ path, data }) => {
  const promise = new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

  return promise;
};
