const readFile = require('./read-file');
const writeFile = require('./write-file');

const changeImages = (data) => {
  return new Promise((resolve, reject) => {
    readFile({ path: 'templates/pdf.html' })
      .then((file) => {
        const strOld = `.${data.imgName} {
      top: ${data.oldPosition.top}px;
      left: ${data.oldPosition.left}px;
      width: ${data.oldPosition.width}px;
      transform: rotate(${data.oldPosition.rotate}deg)`;
        const strNew = `.${data.imgName} {
      top: ${data.newPosition.top}px;
      left: ${data.newPosition.left}px;
      width: ${data.newPosition.width}px;
      transform: rotate(${data.newPosition.rotate}deg)`;

        const fileNew = file.replace(strOld, strNew);

        return writeFile({ path: 'templates/pdf.html', data: fileNew });
      })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
};

module.exports = changeImages;
