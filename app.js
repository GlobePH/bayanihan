/**
 * Filename: ./app.js
 * Author: Kenneth Bastian <kenneth.g.bastian@descouvre.com>
 */

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const config = require('./modules/config');
const redis = require('./modules/redis');

//- Middlewares
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const ResponseCall = require('./modules/ResponseCall');

app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(helmet());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use((err, req, res, next) => {
  next();
});

app.get('/', (req, res, next) => {
  const start = Number(req.query.start);
  const stop = Number(req.query.stop);
  redis.getResponseCalls(start, stop, (err, list) => {
    if(err) { return res.status(500).send({ ok: false, message: 'Cannot get sms list' }); }

    res.status(200).send(list);
  });
});

app.post('/sms', (req, res, next) => {
  if(!req.body) { return res.status(400).send({ ok: false, message: 'No response body available' }); }
  const rc = new ResponseCall(req.body);
  redis.lpushResponseCall(rc, (err) => {
    if(err) { return res.status(500).send({ ok: false, message: 'SMS not acknowledged' }); }

    console.log(rc.print);
    res.status(201).send({ ok: true, message: 'SMS acknowledged' });
  });
});

const port = process.env.PORT || config.port;
redis.init(config, () => {
  http.listen(port, () => {
    console.log('App started listening to port:', port);
  });
});

