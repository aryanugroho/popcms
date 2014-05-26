var db = require("../../db/pages/");
 
module.exports = function attachHandlers (router) { 
    // get requests
    router.get('/api/pages', list);
    router.get('/api/pages/:id', view); 
    router.post('/api/pages', isAuthenticatedRequest, upsertPermalink); 
};
  
function isAuthenticatedRequest(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send(403);
  }
};

function list(req, res)
{ 
    db.getAll({}, function(data){
        res.json(data);
    });
}

function view(req, res)
{ 
    db.getById(req.params.id, function(data){
        res.json(data);
    });
} 

function upsertPermalink(req, res)
{  
    if(
        !req.body.hasOwnProperty('template') ||
        !req.body.hasOwnProperty('permalink') 
            
            ){
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    
    var dataToStore = {
        "template": req.body.template,
        "permalink": req.body.permalink, 
        "modifiedDate": new Date(),
        "modifiedBy": req.user.displayName
    };



    if(req.body.title !== null){dataToStore.title = req.body.title;}
    if(req.body.keywords !== null){dataToStore.keywords = req.body.keywords;}
    if(req.body.description !== null){dataToStore.description = req.body.description;}
    if(req.body.body !== null){dataToStore.body = req.body.body;}
    
    
    console.log(dataToStore);

    db.upsertPermalink(dataToStore, function(err, data){
		if(err){return res.statusCode(500);}
        res.type('application/json');
        res.json({"Status":200, "Message" : "Success", "Data" : data});
    });
} 
