const express = require('express');
const http = require('http');
const logger = require('./libs/log'); // логирование в консоль
const morgan = require('morgan'); // логирование запросов с клиента в консоль
const bodyParser = require('body-parser');
const path = require('path');
const createData = require('./libs/create-data.js');
const Emitter = require("events");

const app = express();
app.set('port', 8080);
app.set('views', path.join(__dirname, 'pdf.html'));
app.set('view engine', 'ejs');
app.use(morgan('tiny')); // логирование запросов с клиента в консоль
app.use(bodyParser.json());
var emitter = new Emitter();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  next();
});


let isPanding = false;

app.post('/application', (req, res) => {
  if (isPanding) {
    res.json({ isPanding: true });
    return;
  }
  isPanding = true;
  emitter.emit('reguestData', req.body);
  const onResponse = (responseData) => {
    res.json(responseData);
    emitter.removeListener('responseData', onResponse);
    isPanding = false;
  }
  emitter.on('responseData', onResponse);
});



app.post('/bitrix', (req, res) => {
  const onRequest = (reguestData) => {
    console.log(reguestData);
    res.json(reguestData);
    emitter.removeListener('reguestData', onRequest);
  }
  emitter.on('reguestData', onRequest);

  if (req.body.empty) {
    return;
  }
  createData({ req, emitter })
});


http.createServer(app).listen(8080, () => {
  logger.info('Express server listening on port ' + 8080);
});
