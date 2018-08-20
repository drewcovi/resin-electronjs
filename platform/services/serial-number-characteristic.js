const util = require('util');
const os = require('os');
const exec = require('child_process').exec;
const bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

let SerialNumberCharacteristic = function() {
  SerialNumberCharacteristic.super_.call(this, {
    uuid: '2A25',
    properties: ['read'],
    value: new Buffer('1x1x1x'),
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: new Buffer('Serial Number')
      })
    ]
  });
};
util.inherits(SerialNumberCharacteristic, Characteristic);

module.exports = SerialNumberCharacteristic;
