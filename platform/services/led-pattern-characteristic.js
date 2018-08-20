const util = require('util');
const os = require('os');
const bleno = require('bleno');
const Db = require('tingodb')().Db;
const assert = require('assert');
const lights = require('./lights');
const Animation = lights.animate;
 

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DeviceCharacteristic = function() {
  DeviceCharacteristic.super_.call(this, {
    uuid: '6c656473-0000-1000-8000-00805f9b34fb',
    properties: ['read','write'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: new Buffer('LED Pattern')
      })
    ]
  });
};

DeviceCharacteristic.prototype.onWriteRequest = function(data, offset,withoutResponse,callback){
    let value = data.toString('utf8');
    new Animation([
    ,{
      pattern: 'pulse',
      color: '0xff0000',
      start: 180,
      speed: 100
    }
    ,{
      pattern: 'pulse',
      color: '0x0000ff',
      start: 180,
      speed: 100
    }
    ]);
};

DeviceCharacteristic.prototype.onReadRequest = function(offset,callback){
  let result = this.RESULT_SUCCESS;
}


util.inherits(DeviceCharacteristic, Characteristic);

module.exports = DeviceCharacteristic;
