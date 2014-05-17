var dbconn = require("../");
var mongo = require("mongodb");
var BSON = mongo.BSONPure;  

exports.getByPermalink= function (permalink, callback) { 
	
    dbconn.getDb("mongodb://127.0.0.1:27017/popcms", function(err, db){ 
		if(err)
		{
			return callback(err);
		} 
		db.collection("pages").findOne({"permalink": permalink }, function (err, data) { 
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
