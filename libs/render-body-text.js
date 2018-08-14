const ejs = require('ejs');

const renderBodyText = ({
  gender,
  firstName,
  middleName,
}) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile('templates/body-text.html', {
      gender,
      firstName,
      middleName,
    }, (err, html) => {
      if (err) {
        console.log('Ошибка создания тела письма');
        reject(err);
        return;
      }
      resolve(html);
    });
  });
};

module.exports = renderBodyText;
