const util = require('util');
const os = require('os');
const exec = require('child_process').exec;
const bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DeviceNameCharacteristic = function() {
  DeviceNameCharacteristic.super_.call(this, {
    uuid: '2A00',
    properties: ['read'],
    value: new Buffer('Swiss Army Knife'),
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: new Buffer('Device Name')
      })
    ]
  });
};
util.inherits(DeviceNameCharacteristic, Characteristic);

module.exports = DeviceNameCharacteristic;
