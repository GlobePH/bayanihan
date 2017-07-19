/**
 * Filename: ./modules/redis.js
 * Author: Kenneth Bastian <kenneth.g.bastian@descouvre.com>
 */
const redis = require('redis');
const winston = require('winston');
const listName = 'bayanihan';
let client = null;

module.exports.init = function init(config, done) {
  if(!client) {
    client = redis.createClient({
      port: config.redis.port,
      password: config.redis.pass,
      host: config.redis.host
    });
    client
      .on('error', function(err) {
        winston.log('error', 'Redis error:', err);
        done();
      })
      .on('connect', (e) => {
        winston.log('info', 'Connected to redis: ' + config.redis.host);
        done();
      });
  }
};

module.exports.lpushResponseCall = function lpushResponseCall(rc, done) {
  client.lpush(listName, rc.print, (err, res) => {
    if(err) { return done(err); }
    done();
  });
};

module.exports.getResponseCalls = function getResponseCalls(start, stop, done) {
  start = 0;
  stop = 10;
  client.lrange(listName, start, stop, (err, list) => {
    if(err) { return done(err, []); }
    done(null, list);
  });
};

