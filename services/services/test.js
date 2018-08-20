var Db = require('tingodb')().Db,
  assert = require('assert');

var db = new Db('./config', {});
// Fetch a collection to insert document into
var collection = db.collection("batch_document_insert_collection_safe");
// Insert a single document
collection.update({hello:'world_safe2'}, {$set:{foo:'bar'}}, {}, function(err, item) {
    console.log(err,item);
});
