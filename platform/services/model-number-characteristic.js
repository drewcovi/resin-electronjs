const util = require('util');
const os = require('os');
const exec = require('child_process').exec;
const bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var ModelNumberCharacteristic = function() {
  ModelNumberCharacteristic.super_.call(this, {
    uuid: '2A24',
    properties: ['read'],
    value: new Buffer('0001'),
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: new Buffer('Model Number')
      })
    ]
  });
};
util.inherits(ModelNumberCharacteristic, Characteristic);

module.exports = ModelNumberCharacteristic;
