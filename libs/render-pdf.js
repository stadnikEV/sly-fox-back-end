const path = require('path');
const appDir = path.dirname(require.main.filename);
const ejs = require('ejs');
const htmlPdf = require('html-pdf');
const getfileName = require('../templates/get-file-name.js');



const renderPdf = ({
  gender,
  firstName,
  middleName,
  firstNameGenitive,
  middleNameGenitive,
}) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile('templates/pdf.html', { // получение html для pdf
      gender,
      firstName,
      middleName,
    }, (err, html) => {
      if (err) {
        console.log('Ошибка создание html');
        reject(err);
        return;
      }

      const fileName = getfileName({
        firstNameGenitive,
        middleNameGenitive,
      });

      const options = { format: 'A4' };
      const regExp = new RegExp('src="', 'g');
      const renderHtml = html.replace(regExp, 'src="file://localhost' + appDir + "/"); // замена src на абсолютный путь

      htmlPdf.create(renderHtml, options).toFile(fileName, (err) => { // создание и сохранение pdf
        if (err) {
          console.log('Ошибка конвертации pdf');
          reject(err);
          return;
        }

        resolve(fileName);
      });
    });
  });
};

module.exports = renderPdf;
