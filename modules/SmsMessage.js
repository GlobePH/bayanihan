/**
 * SmsMessage.js
 */
const moment = require('moment');

class SmsMessage {
  constructor() {
  }

  get raw() {
    return this.timestamp + ';' + this.mobileNumber + ';' + this.category + ';' + this.message + ';' + this.name;
  }

  static mapFromCache(item) {
    const splits = item.split(';');
    let msg = new SmsMessage();
    msg.timestamp = splits[0];
    msg.mobileNumber = splits[1];
    msg.category = splits[2];
    msg.message = splits[3];
    msg.name = splits[4];
    msg.friendlyDate = moment(msg.timestamp).format('MMM DD, YYYY HH:mm:ss');
    return msg;
  }

  static mapFromInbound(im) {
    const smg = new SmsMessage();
    smg.mobileNumber = im.senderAddress.replace('tel:', '');
    if(smg.mobileNumber=="+639278854260"){ smg.name = "Allysa Marie"; }
    else if(smg.mobileNumber=="+639954889586"){ smg.name = "Mikko Dimapasoc"; }
    else { smg.name = "Unknown"; }
    smg.message = (im.message || '').toLowerCase();
    smg.timestamp = moment().toISOString();
    smg.friendlyDate = moment(smg.timestamp).format('MMM DD, YYYY HH:mm:ss');
    return smg;
  }
}

module.exports = SmsMessage;
