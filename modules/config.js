/**
 * Filename: ./modules/config.js
 * Author: Kenneth Bastian <kenneth.g.bastian@descouvre.com>
 */
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
    port: 6530,
    logging: 'debug',
    globe: {
      id: 'qbR5sgpraoIx5iqxqBcrkKIX9bM8sA5M',
      secret: '47bc01944785c8a9589cf8ab215c9a8d1f1035bb8effefa893bfbe74f1ebb86b'
    }
  },
  dev: {
    redis: {
      port: 6379,
      host: process.env.REDIS_URL,
      pass: process.env.REDIS_KEY
    },
    root: rootPath,
    port: 6530,
    logging: 'debug',
    globe: {
      id: 'qbR5sgpraoIx5iqxqBcrkKIX9bM8sA5M',
      secret: '47bc01944785c8a9589cf8ab215c9a8d1f1035bb8effefa893bfbe74f1ebb86b'
    }
  }
}[env];

