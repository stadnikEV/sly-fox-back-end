const fs = require("fs");

module.exports = ({ path, text }) => {
  const promise = new Promise((resolve, reject) => {

    fs.writeFile(path, text, function(err){
        if(err)  {
          reject();

          return;
        }
        resolve();
    });
  });

  return promise;
}
