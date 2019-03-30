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
    const date = new Date();

    const getDateFormat = (value) => {
      if (value > 9) {
        return value;
      }
      return '0' + value;
    }

    ejs.renderFile('templates/pdf.html', { // получение html для pdf
      day: getDateFormat(date.getDate()),
      month: getDateFormat(date.getMonth() + 1),
      year: date.getFullYear(),
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
      let renderHtml = html.replace(/<script src="js\/create-pdf.js"><\/script>/g, '');
      renderHtml = renderHtml.replace(regExp, 'src="file://localhost' + appDir + "/templates/"); // замена src на абсолютный путь
      console.log(renderHtml);
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
