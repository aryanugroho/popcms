var dbconn = require("../");
var mongo = require("mongodb");
var BSON = mongo.BSONPure;  

var connString = 
		"mongodb://127.0.0.1:27017/popcms";
var collectionName = "pages";

exports.getByPermalink= function (permalink, callback) {  
    dbconn.getDb(connString, function(err, db){ 
		if(err)
		{
			return callback(err);
		} 
		db.collection(collectionName).findOne({"permalink": permalink }, function (err, data) { 
			if (err) { 
				return callback(err); 
			} 
			else
			{ 
				return callback(null, data);
			}
		});
	}); 
};



exports.upsertPermalink = function(data, callback){
	
    console.log("upsertPermalink");
    if(callback === null || typeof(callback) !== "function")
	{
		throw "Call to db method must include callback function";
	}
	
	dbconn.getDb(connString, function(err, db){ 
		if(err)
		{
			return callback(err);
		}  
		db.collection(collectionName).update(
		{
			"permalink" : data.permalink
		}
		,data, {"upsert" : 1, "new" : 1}, function(err, n)
		{  
			if(err){    
				console.log("Error:" + err);
				callback(err);
			}
			else{
				db.collection(collectionName+"Versions").update(
				{
					"permalink" : data.permalink
				}, 
				{
					$push  : {"Versions"  :  data } 
				}, 
				{
					"upsert" : 1
				}, 
				function(err){ 
				}); 
				callback(null, n);
			}
		});
	});
}; 


