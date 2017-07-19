const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  // NOTE used for local development
  development: {
    redis: {
      port: 6379,
      host: process.env.REDIS_URL,
      pass: process.env.REDIS_KEY
    },
    root: rootPath,
    port: process.env.PORT || 6510
  },
  dev: {
    redis: {
      port: 6379,
      host: process.env.REDIS_URL,
      pass: process.env.REDIS_KEY
    },
    root: rootPath,
    port: process.env.PORT || 6510
  }
}[env];

