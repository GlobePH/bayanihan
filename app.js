/**
 * Filename: ./app.js
 * Author: Kenneth Bastian <kenneth.g.bastian@descouvre.com>
 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const socketIo = require('socket.io')(http);
const config = require('./modules/config');
const redis = require('./modules/redis');
const winston = require('winston');

//- Middlewares
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const model = require('./modules/model');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(helmet());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.set('view engine', 'pug');

const port = config.port;
winston.level = config.logging;
redis.init(config, () => {
  require('./modules/router')(app, socketIo, model);
  http.listen(port, () => {
    winston.log('info', 'App started listening to port:', port);
  });
});

