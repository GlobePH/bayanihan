/**
 * ResponseCall.js
 */

const moment = require('moment');

class ResponseCall {
  constructor(body) {
    body = body || {};
    let self = this;
    const splits = body.message.split(' ');
    const coords = splits[0].split(',');
    self.mobileNumber = body.mobile;
    self.latitude = coords[0];
    self.longitude = coords[1];
    self.name = splits[1];
    self.action = splits[2];
  }

  get print() {
    return moment().format('MMM DD, YYYY HH:mm:ss') + ' '  + this.mobileNumber + ' by ' + 
      this.name  + ' on (' + this.latitude + ',' + this.longitude + ')';
  }
}

module.exports = ResponseCall;
