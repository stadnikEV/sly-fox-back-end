const getNameGenitive = require('../libs/get-name-genitive.js');
const renderBodyText = require('../libs/render-body-text.js');
const getThemeText = require('../templates/get-theme-text.js');



const createData = ({ req, emitter }) => {
  return new Promise ((resolve) => {
    const firstName = req.body.name[1];
    const middleName = req.body.name[2];
    const email = req.body.email;
    const index = req.body.index;
    const length = req.body.length;
    const notSend = req.body.notSend;
    const currentPage = req.body.currentPage;
    let gender = null;
    let firstNameGenitive = null;
    let middleNameGenitive = null;
    let body = null;



    const nameGenitive = getNameGenitive({
        firstName: firstName,
        middleName: middleName,
    });

    gender = nameGenitive.gender;
    firstNameGenitive = nameGenitive.firstName;
    middleNameGenitive = nameGenitive.middleName;

    renderBodyText({
      gender,
      firstName,
      middleName,
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
          currentPage,
          text: {
            email,
            theme: themeText,
            body,
          }
        };
        emitter.emit('responseData', dataBitrix);
        resolve({
          gender,
          firstName,
          middleName,
          firstNameGenitive,
          middleNameGenitive,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

module.exports = createData;
