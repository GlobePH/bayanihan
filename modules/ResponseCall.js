/**
 * Filename: ./modules/ResponseCall.js
 * Author: Kenneth Bastian <kenneth.g.bastian@descouvre.com>
 */
'use strict';
const moment = require('moment');

class ResponseCall {
  constructor(body) {
    // body = body || {};
    // let self = this;
    // const splits = body.message.split(' ');
    // const coords = splits[0].split(',');
    // self.mobileNumber = body.mobile;
    // self.latitude = coords[0];
    // self.longitude = coords[1];
    // self.name = splits[1];
    // self.action = splits[2];
  }

  get print() {
    return moment().format('MMMM DD, YYYY HH:mm:ss') + ' '  + this.mobileNumber + ' by ' +
      this.name  + ' on (' + this.latitude + ',' + this.longitude + ')';
  }

  get raw() {
    return moment().toISOString()+ ' ' + this.mobileNumber + ' ' + this.name + ' ' + 
      this.latitude + ' ' + this.longitude + ' ' + this.action;
  }

  static map(rawRC) {
    let arrayData = rawRC.split(' ');
    let dateData = moment(arrayData[0]).format('MMMM DD, YYYY h:mm:ss a')
    let objectData = {
      timestamp: dateData,
      mobileNumber: arrayData[1],
      latitude: arrayData[3],
      longitude: arrayData[4],
      name: arrayData[2],
      action: arrayData[5]
    };
    return objectData;
  }

  static formatBody(inboundSMSMessage) {
    const splits = inboundSMSMessage.message.split(' ');
    const coords = splits[0].split(',');
    const rc = new ResponseCall();
    rc.mobileNumber = inboundSMSMessage.senderAddress.replace('tel:', '');
    rc.latitude = coords[0];
    rc.longitude = coords[1];
    rc.name = splits[1];
    rc.action = splits[2];
    return rc;
  }
}

module.exports = ResponseCall;
