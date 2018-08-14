const removeFile = require('../libs/remove-file.js');
const getNameGenitive = require('../libs/get-name-genitive.js');
const renderPdf = require('../libs/render-pdf.js');
const renderBodyText = require('../libs/render-body-text.js');
const getThemeText = require('../templates/get-theme-text.js');

let lastFileNamePath = '';

const createData = ({ req, emitter }) => {
  const firstName = req.body.name[1];
  const middleName = req.body.name[2];
  const email = req.body.email;
  const index = req.body.index;
  const length = req.body.length;
  const notSend = req.body.notSend;
  let gender = null;
  let firstNameGenitive = null;
  let middleNameGenitive = null;
  let body = null;

  removeFile({ path: lastFileNamePath })
    .then(() => {

      const nameGenitive = getNameGenitive({
          firstName: firstName,
          middleName: middleName,
      });

      gender = nameGenitive.gender;
      firstNameGenitive = nameGenitive.firstName;
      middleNameGenitive = nameGenitive.middleName;
      return renderPdf({
        gender,
        firstName,
        middleName,
        firstNameGenitive,
        middleNameGenitive,
      });
    })
    .then((fileName) => {
      lastFileNamePath = fileName;
      return renderBodyText({
        gender,
        firstName,
        middleName,
      });
    })
    .then((bodyText) => {
      body = bodyText;
      const themeText = getThemeText({
        firstNameGenitive,
        middleNameGenitive,
      });
      const dataBitrix = {
        firstName,
        middleName,
        index,
        length,
        notSend,
        text: {
          email,
          theme: themeText,
          body,
        }
      };
      console.log(dataBitrix);
      emitter.emit('responseData', dataBitrix);
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = createData;
