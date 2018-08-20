const util = require('util');
const os = require('os');
const bleno = require('bleno');
const wifi = require('node-wifi');


var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var ConnectedSSIDCharacteristic = function() {
  ConnectedSSIDCharacteristic.super_.call(this, {
    uuid: '2A3D',
    properties: ['read'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: new Buffer('Network')
      })
    ]
  });
};

ConnectedSSIDCharacteristic.prototype.onReadRequest = function(offset,callback){
  return wifi
    .getCurrentConnections()
    .then((connections)=>{
      let ssid = connections.length ? connections[0].ssid : "";
      let result = this.RESULT_SUCCESS;
      callback(result, new Buffer(ssid));
    });
}

util.inherits(ConnectedSSIDCharacteristic, Characteristic);

module.exports = ConnectedSSIDCharacteristic;
