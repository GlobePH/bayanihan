/**
 * Filename: ./modules/router.js
 * Author: Kenneth Bastian <kenneth.g.bastian@descouvre.com>
 */
const ResponseCall = require('../modules/ResponseCall');
const redis = require('../modules/redis');
const winston = require('winston');

module.exports = function router(app, socketIo) {
  app.get('/', (req, res, next) => {
    res.render('admin', {});
  });

  app.get('/profile', (req, res, next) => {
    res.render('profile', {});
  });

  app.get('/sms', (req, res, next) => {
    const start = Number(req.query.start) || 0;
    const stop = Number(req.query.stop) || 100;
    const name = req.query.name;
    redis.getResponseCalls(start, stop, (err, list) => {
      if(err) { return res.status(500).send({ ok: false, message: 'Cannot get sms list' }); }
      const li = list.map(ResponseCall.map);
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
    const rcs = req.body.inboundSMSMessageList.inboundSMSMessage.map(ResponseCall.formatBody);

    let queue = [];
    let counter = 0;
    for(let i = 0; i < rcs.length; ++i) {
      queue.push({
        exec: (rc) => {
          redis.lpushResponseCall(rc, (err) => {
            if(err) {
              winston.log('debug', err);
              return res.status(500).send({ ok: false, message: 'Cannot save sms' });
            }

            winston.log('debug', rc.print);
            socketIo.emit('received-sms', rc);

            //- recursive call on exec to create a synchronous flow
            if(++counter < rcs.length) { return queue[counter].exec(rcs[counter]); }

            return res.status(201).send({ ok: true, message: 'SMS acknowledged' });
          });
        }
      });
    }
    queue[0].exec(rcs[0]);
  });

  app.use((err, req, res, next) => {
    winston.log('error', err);
    res.status(500).send({ ok: false, message: 'Internal server error' });
  });

  socketIo.on('connection', function(socket) {
    winston.log('info', 'SOCKET: A user has connected');

    socket.on('received-sms', function() {

    });

    socket.on('disconnect', function() {
      winston.log('info', 'SOCKET: A user has disconnected');
    });
  });

};

