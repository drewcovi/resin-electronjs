const util = require('util');
const os = require('os');
const exec = require('child_process').exec;
const bleno = require('bleno');
const wifi = require('node-wifi');
let discovered = [];
let truncated = [];
let readCount = 0;
var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;
wifi.init({
    iface : 'wlan0' // network interface, choose a random wifi interface if set to null
});
let APDetailsCharacteristic = function() {
  APDetailsCharacteristic.super_.call(this, {
    uuid: 'fb8c0011-d224-11e4-85a1-0002a5d5c51b',
    properties: ['read','write'],
    // value: new Buffer([
    //
    // ]),
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: new Buffer('Access Point Details')
      })
    ]
  });
};
APDetailsCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback){
  console.log('data arrived', data, data.toString('utf8'));
  let creds = JSON.parse(data.toString('utf8'));
  let characteristic = this;
  wifi.disconnect(function(err) {
    if (err) {
        // console.log(err);
    }
    console.log('resetting wifi connection...', creds.ssid);
    wifi.connect({
      ssid: creds.ssid,
      password: creds.password
    }, function(err){
      if (err) {
          console.log(err);
          callback(characteristic.RESULT_UNLIKELY_ERROR);
      }else{
        console.log('success');
        bleno.emit('wifiConnected');
	      callback(characteristic.RESULT_SUCCESS);
      }
    });
  });

}
APDetailsCharacteristic.prototype.onReadRequest = function(offset,callback){

  var result = this.RESULT_SUCCESS;
  console.log(offset, truncated.length);
  if(offset === 0){
    bleno.emit('readRequest');
    readCount = 0;
    // Scan networks
    wifi
      .getCurrentConnections()
      .then( (connections)=>{
          ssids = connections.map( (ap)=>{
            return ap.ssid;
          });
          wifi
            .scan()
            .then( (aps)=> {
              console.log('mapping aps');
              aps = aps
                .filter( (ap, pos)=>{
                  let first = aps.find(function(item){
                    return item.ssid === ap.ssid;
                  });
                  return aps.indexOf(first) === pos;
                })
                .filter( (ap)=>{
                  return ap.security === 'WPA2' || ap.security === 'WPA1 WPA2';
                })
                .filter( (ap)=>{
                  return ap.ssid != '--'
                }).map( (ap)=>{
                  console.log(ap);
                  return {
                   id: ap.ssid,
                   s: Math.round(3+(Math.max(-80, Math.min(ap.signal_level,-60))+60)/10)                  }
                });
              aps.forEach( (ap)=>{
                if(ssids.includes(ap.id)){
                  ap.c=1;
                }else{
                  ap.c=0;
                }
              });
              console.log(aps);
              let data = Buffer.from('[');
              aps.some( (ap, index)=>{
                let delimiter = index < (aps.length - 1) ? ',':'';
                console.log(index, aps.length, JSON.stringify(ap)+delimiter);
                data = Buffer.concat([data,Buffer.from(JSON.stringify(ap)+delimiter,'utf8')]);
                return data.length >= 511;
              });
              data = Buffer.concat([data,Buffer.from(']')]);
              console.log(data, data.length);
              discovered = data;
              truncated = data.slice(offset);
              if(!offset || data.length <= offset){
                bleno.emit('readDone');
              }
              console.log(offset, truncated.length);
              callback(result, truncated);
            });
     });
  }
  else if (offset > truncated.length) {
    result = this.RESULT_INVALID_OFFSET;
    data = null;
    callback(result, data);
  } else {
    data = truncated.slice(offset);
    if(data.length < offset/readCount){
      bleno.emit('readDone');
    }
    readCount++;
    callback(result, data);
  }

}
util.inherits(APDetailsCharacteristic, Characteristic);

module.exports = APDetailsCharacteristic;
