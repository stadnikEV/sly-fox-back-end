
module.exports = (statistics) => {
  const result = {
    allSended: statistics['Всего отправлено'],
    allNotSended: statistics['Всего не отправлено'],
    timeStart: statistics['Начало отправки'],
    timeEnd: statistics['Последняя отправка'].time,
    email: {},
  }


  statistics['Отправленные'].forEach((item) => {
    if (!result.email[item.email]) {
      result.email[item.email] = {};
    }
    if (!result.email[item.email].sended) {
      result.email[item.email].sended = 0;
    }
    result.email[item.email].sended += 1;
  });


  statistics['Не отправленные'].forEach((item) => {
    if (!result.email[item.email]) {
      result.email[item.email] = {};
    }
    if (!result.email[item.email].notSended) {
      result.email[item.email].notSended = 0;
    }
    result.email[item.email].notSended += 1;
  });


  statistics['Не дошедшие'].forEach((item) => {
    if (!result.email[item.email]) {
      result.email[item.email] = {};
    }
    if (!result.email[item.email].notDelivery) {
      result.email[item.email].notDelivery = 0;
    }
    result.email[item.email].notDelivery += 1;
  });

  const all = `из ${result.allSended} (+${result.allNotSended})
`;

  let email = '';

  Object.keys(result.email).forEach((item) => {
    if (!result.email[item].sended) {
      result.email[item].sended = 0;
    }
    if (!result.email[item].notSended) {
      result.email[item].notSended = 0;
    }
    if (!result.email[item].notDelivery) {
      result.email[item].notDelivery = 0;
    }
    email += `${item} - ${result.email[item].sended} (${result.email[item].notDelivery} не доставлено, 0 не доставлено старых, ${result.email[item].notSended} не отправлено)
`
  });

  const time = `
отправка с ${result.timeStart} по ${result.timeEnd}`

  const str = all + email + 'регион - мск' + time;

  return str;
};
