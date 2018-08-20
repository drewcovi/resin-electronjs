const util = require('util');
const os = require('os');
const bleno = require('bleno');
const Db = require('tingodb')().Db;
const assert = require('assert');
const ID = 0;

var db = new Db(__dirname+'/config', {});
 
var collection = db.collection("config");

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DeviceCharacteristic = function() {
  DeviceCharacteristic.super_.call(this, {
    uuid: '3b95a516-8fc7-46d2-b618-0ad08954bc44',
    properties: ['read','write'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: new Buffer('Energy Rating')
      }),
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x25,0x01, 0x27, 0xAD, 0x01, 0x00, 0x00])
      })
    ]
  });
};

DeviceCharacteristic.prototype.onWriteRequest = function(data, offset,withoutResponse,callback){
    console.log('data:',data);
    let value = data.toString('utf8');
    console.log('value:',value);
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
    callback(result, new Buffer.from(value));
    db.close();
  });
}


util.inherits(DeviceCharacteristic, Characteristic);

module.exports = DeviceCharacteristic;
