const util = require('util');
const os = require('os');
const bleno = require('bleno');
const Db = require('tingodb')().Db;
const assert = require('assert');
const ID = 2;

var db = new Db(__dirname+'/config', {});
 
var collection = db.collection('config');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DeviceCharacteristic = function() {
  DeviceCharacteristic.super_.call(this, {
    uuid: '50b8eca5-36aa-4d7e-a142-02080d697de6',
    properties: ['read','write'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: new Buffer('Tank Size')
      }),
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x08,0x01, 0x27, 0x67, 0x01, 0x00, 0x00])
//        value: new Buffer('gal (US)')
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
    console.log(err,item);
    let value = item?item.value:'';
    callback(result, new Buffer(value));
    db.close();
  });
}


util.inherits(DeviceCharacteristic, Characteristic);

module.exports = DeviceCharacteristic;
