const path = require('path');
const appDir = path.dirname(require.main.filename);

const getFileName = ({
  firstNameGenitive,
  middleNameGenitive,
}) => {
  return `${appDir}/my-pdf/Для ${firstNameGenitive} ${middleNameGenitive}.pdf`;
}

module.exports = getFileName;
