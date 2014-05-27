var mongo = require("mongodb");
var MongoClient = mongo.MongoClient; 
var dbconn; 

exports.getDb = function(connString, callback){
    if(dbconn)
	{
		callback(null, dbconn);
	}
	else
	{
		MongoClient.connect(connString, function(err, db) {
			if(err){
				return callback(err);
			}
			else
			{
				dbconn = db;
				callback(null, db);
				console.log("Db Connected");
			}
		}); 
	}
};