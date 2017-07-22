/**
 * Filename: ./app.js
 * Author: Kenneth Bastian <kenneth.g.bastian@descouvre.com>
 */

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const config = require('./modules/config');
const redis = require('./modules/redis');
const winston = require('winston');


//- Middlewares
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const ResponseCall = require('./modules/ResponseCall');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(helmet());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.set('view engine', 'pug');

app.get('/', (req, res, next) => {
  res.render('admin', {});
});

app.post('/sms', (req, res, next) => {
  if(!req.body) { return res.status(400).send({ ok: false, message: 'No response body available' }); }
  winston.log('debug', '/sms-body', req.body);
  const rc = new ResponseCall(req.body);
  redis.lpushResponseCall(rc, (err) => {
    if(err) { return res.status(500).send({ ok: false, message: 'SMS not acknowledged' }); }

    winston.log('debug', rc.print);
    res.status(201).send({ ok: true, message: 'SMS acknowledged' });
  });
});

app.get('/sms', (req, res, next) => {
  const start = Number(req.query.start);
  const stop = Number(req.query.stop);
  redis.getResponseCalls(start, stop, (err, list) => {
    if(err) { return res.status(500).send({ ok: false, message: 'Cannot get sms list' }); }

    res.status(200).send(list.map(ResponseCall.map));
  });
});

app.use((err, req, res, next) => {
  winston.log('error', err);
  res.status(500).send({ ok: false, message: 'Internal server error' });
});

const port = process.env.PORT || config.port;
winston.level = config.logging;
redis.init(config, () => {
  http.listen(port, () => {
    winston.log('info', 'App started listening to port:', port);
  });
});

