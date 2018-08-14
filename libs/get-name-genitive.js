const petrovich = require('petrovich');

const getNameGenitive = ({ firstName, middleName }) => {
  const person = {
   first: firstName,
   middle: middleName,
  };
  const genitive = petrovich(person, 'genitive');
  let gender = null;
  if (genitive.gender === 'male') {
   gender = 'Уважаемый';
  } else {
   gender = 'Уважаемая';
  }
  return {
    firstName: genitive.first,
    middleName: genitive.middle,
    gender,
  }
};

module.exports = getNameGenitive;
