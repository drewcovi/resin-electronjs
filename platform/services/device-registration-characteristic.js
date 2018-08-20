const util = require('util');
const os = require('os');
const bleno = require('bleno');
const Db = require('tingodb')().Db;
const assert = require('assert');
const ID = 3;

var db = new Db('./config', {});
 
var collection = db.collection('config');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DeviceCharacteristic = function() {
  DeviceCharacteristic.super_.call(this, {
    uuid: '2A3D',
    properties: ['read','write'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: new Buffer('Account Number')
      })
    ]
  });
};

DeviceCharacteristic.prototype.onWriteRequest = function(data, offset,withoutResponse,callback){
    let value = data.toString('utf8');
    let collection = db.collection('config')

    collection
      .findOne(
        {id:ID}, 
        function(err,item){
          console.log(err,item);
          collection
            .update(
              {id:ID},
              {$set:{
                value: value
              }},
              {upsert: true},
              function (err, item) {
                console.log(err,item);
                callback(this.RESULT_SUCCESS);
              });
        }
      );
};

DeviceCharacteristic.prototype.onReadRequest = function(offset,callback){
  let result = this.RESULT_SUCCESS;
  db.collection('config').findOne({id:ID},function(err, item){
    let value = item?item.value:'';
    callback(result, new Buffer(value));
    db.close();
  });
}


util.inherits(DeviceCharacteristic, Characteristic);

module.exports = DeviceCharacteristic;
