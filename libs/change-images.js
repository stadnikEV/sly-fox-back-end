const readFile = require('./read-file');
const writeFile = require('./write-file');

const changeImages = (data) => {
  return new Promise((resolve, reject) => {
    const path = (data.imgName !== 'background')
      ? 'templates/pdf.html'
      : 'templates/js/create-pdf.js';

    readFile({ path })
      .then((file) => {
        const strOld = (data.imgName !== 'background')
          ? `.${data.imgName} {
      top: ${data.oldPosition.top}px;
      left: ${data.oldPosition.left}px;
      width: ${data.oldPosition.width}px;
      transform: rotate(${data.oldPosition.rotate}deg)`
          : `${data.imgName}.style.top = '${data.oldPosition.top}px'`;

        const strNew = (data.imgName !== 'background')
          ? `.${data.imgName} {
      top: ${data.newPosition.top}px;
      left: ${data.newPosition.left}px;
      width: ${data.newPosition.width}px;
      transform: rotate(${data.newPosition.rotate}deg)`
          : `${data.imgName}.style.top = '${data.newPosition.top}px'`;

        const fileNew = file.replace(strOld, strNew);

        return writeFile({ path, data: fileNew });
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
