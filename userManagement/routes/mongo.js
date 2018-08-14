var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/";

mongoClient.connect(url, obj, function(err, db) {
      createDocuments(db, obj, function() {
	    db.close();
	  });
});

var createDocuments = function(db, obj, callback) {
     var collection = db.collection("users");
     collection.insert(obj, function(err, result) {
       if(err)
        return err;
        console.log("Inserted")
	callback(result);
      });
}
