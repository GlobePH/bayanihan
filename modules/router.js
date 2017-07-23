/**
 * Filename: ./modules/router.js
 * Author: Kenneth Bastian <kenneth.g.bastian@descouvre.com>
 */
const SmsMessage = require('../modules/SmsMessage');
const redis = require('../modules/redis');
const winston = require('winston');

module.exports = function router(app, socketIo, model) {
  app.get('/', (req, res, next) => {
    res.render('index', {});
  });

  app.get('/profile', (req, res, next) => {
    res.render('profile', {});
  });

  app.get('/map', (req, res, next) => {
    res.render('map', {});
  });

  app.get('/sms', (req, res, next) => {
    const start = Number(req.query.start) || 0;
    const stop = Number(req.query.stop) || 100;
    const name = req.query.name;
    redis.getResponseCalls(start, stop, (err, list) => {
      if(err) { return res.status(500).send({ ok: false, message: 'Cannot get sms list' }); }

      const li = list.map(SmsMessage.mapFromCache);
      if(Boolean(name)) {
        const filteredList = li.filter(r => r.name === name);
        return res.status(200).send(filteredList);
      }
      res.status(200).send(li);
    });
  });

  app.get('/globe', (err, req, res, next) => {
    const code = req.query.code;
    winston.log('debug', 'Globe code ' + code);
    res.render('globe', {});
  });

  app.post('/globe/sms', (req, res, next) => {
    if(!req.body) { return res.status(400).send({ ok: false, message: 'No response body available' }); }
    winston.log('debug', '/globe/sms-body', req.body);
    const msgs = req.body.inboundSMSMessageList.inboundSMSMessage.map(SmsMessage.mapFromInbound);

    let queue = [];
    let counter = 0;
    for(let i = 0; i < msgs.length; ++i) {
      queue.push({
        exec: (msg) => {
          msg.category = model.classifier.categorize(msg.message);
          redis.lpushResponseCall(msg, (err) => {
            if(err) {
              winston.log('debug', err);
              return res.status(500).send({ ok: false, message: 'Cannot save sms' });
            }

            winston.log('debug', msg);
            socketIo.emit('received-sms', msg);

            //- recursive call on exec to create a synchronous flow
            if(++counter < msgs.length) { return queue[counter].exec(msgs[counter]); }

            return res.status(201).send({ ok: true, message: 'SMS acknowledged' });
          });
        }
      });
    }
    queue[0].exec(msgs[0]);
  });

  app.use((err, req, res, next) => {
    winston.log('error', err);
    res.status(500).send({ ok: false, message: 'Internal server error' });
  });

  socketIo.on('connection', function(socket) {
    winston.log('info', 'SOCKET: A user has connected');

    socket.on('disconnect', function() {
      winston.log('info', 'SOCKET: A user has disconnected');
    });
  });

};

