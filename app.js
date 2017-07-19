const express = require('express');
const app = express();
const http = require('http').createServer(app);
const config = require('./modules/config');

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

app.post('/sms', (req, res, next) => {
  if(!req.body) { return res.status(400).send({ ok: false, message: 'No body' }); }
  const rc = new ResponseCall(req.body);
  console.log(rc.print);
  res.status(200).send({ ok: true, message: 'SMS received' });
});

const port = process.env.PORT || config.port;
http.listen(port, () => {
  console.log('App started listening to port:', port);
});

