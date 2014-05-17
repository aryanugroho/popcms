var handlebars = require('handlebars'); 
var handlebarsHelpers = require('./handlebarsHelpers.js'); 
var fs = require('fs'); 
var pages = require('../db/pages/');
var navigation = require('../db/navigation/'); 

var nav = null;
var templatePath = __dirname + '/../html';

navigation.getFullNav(function(data){
    nav=data;
});

handlebarsHelpers.register(handlebars);
 
var cache = {}; 

var getPageFromCache = function(url, callback) {   
    if (cache[url]) { 
        return callback(undefined, cache[url]);
    } else { 
        return callback();
    }
}; 

var setPageToCache= function(url, content) {
    cache[url] = content;
};

var removePageFromCache= function(url) { 
    cache[url] = null;
};
 
function implementTemplate(req, pageData, callback) {
	
 
    var body = fs.readFileSync(templatePath + '/master.html', 'utf8'); 
    var source = fs.readFileSync(templatePath + '/' + 'landing-page' + '.html', 'utf8'); 
    var template = handlebars.compile(body.replace("[[[body]]]", source)); 
    var result = template(pageData);  

    return callback(null, result);
}

function getPageFromDb(req, callback){
 
    try{   
        pages.getByPermalink(req.url, function (err, data) 
		{  
			if(err){return callback(err);}
			
			if(data ===null && req.url==="/login"){
				return callback(null, "<html><title>Login</title><body>If you wish. you can create a new login.html file in your templates folder. In the meantime, <a href='/auth/google'>Login via Google</a>.</body></html>");
			}
			
			if(data===null){ 
				data = {title:"Page not found"}
			}
			
			if(req.user)
			{
				data.admin = true;
				
			}

			implementTemplate(req, data, function(err, htmlContent){
				if(err){return callback(err);}
				return callback(null, htmlContent);
			});
		}); 
	}
    catch(e)
    {
		return callback(e); 
    }
 }
 

exports.setConfig = function(settings){
	templatePath = settings.templatePath;
};

exports.getPage =function(req, res) {  
	getPageFromDb(req, function (err, htmlContent)
	{
		if(err){console.log(err);return res.send(500);}
		return res.send(htmlContent);
	});

};