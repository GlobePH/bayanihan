/**
 * Filename: ./modules/router.js
 * Author: Kenneth Bastian <kenneth.g.bastian@descouvre.com>
 */
const ResponseCall = require('./modules/ResponseCall');
const redis = require('./modules/redis');
const winston = require('winston');

module.exports = function router(app) {
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
    if(isNaN(start) || isNaN(stop)) {
      return res.status(400).send({ ok: false, message: 'Invalid start or stop' });
    }
    redis.getResponseCalls(start, stop, (err, list) => {
      if(err) { return res.status(500).send({ ok: false, message: 'Cannot get sms list' }); }

      res.status(200).send(list.map(ResponseCall.map));
    });
  });

  app.use((err, req, res, next) => {
    winston.log('error', err);
    res.status(500).send({ ok: false, message: 'Internal server error' });
  });
};
