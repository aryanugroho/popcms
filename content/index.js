var handlebars = require('handlebars'); 
var handlebarsHelpers = require('./handlebarsHelpers.js'); 
var fs = require('fs'); 
var pages = require('../db/pages/');
var navigation = require('../db/navigation/'); 

var nav = null;
var templatePath = __dirname + '/../html';

navigation.getFullNav(function(err, data){
	if(err){console.log(err)}
	console.log('got nav:' + data);
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
	
	
	if(pageData===null) {pageData = {};}
	if(pageData.template === null || typeof(pageData.template) === "undefined")
	{
		pageData.template="404.html";
	}
 
    var body, source;
	try
	{
		body = fs.readFileSync(templatePath + '/master.html', 'utf8'); 
	}
	catch(e)
	{
		body="Please add your master page at '" + templatePath + "/master.html'";
	}
	
	try
	{
		source= fs.readFileSync(templatePath + '/' + pageData.template + '', 'utf8'); 
	}
	catch(e)
	{
		source="Please add your selected template file to '" + templatePath + "/" + pageData.template + "'";
	};
	
	body = body.replace("[[[body]]]", source);
	
	pageData.navigation = nav;
	
	console.log("Data : " + JSON.stringify(pageData));
	
	if(pageData.admin){
		var adminHtml = fs.readFileSync(__dirname + '/html/parts/page-admin-form.html', 'utf8'); 
		body = body.replace("</body>", adminHtml + "</body>");
		
		// get list of templates
		var files = fs.readdirSync(templatePath);
		// will eventually be a bit more delicate with this, for instance filting based on filename or extension.
		pageData.templateList = []; 
		files.forEach(function(entry) {
			if(entry!=="master.html")
			{
				pageData.templateList.push({"name" : entry}); 
			}
			
		});
	}
	
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
				data.contentEditable = false;
			}
			
			if(req.user)
			{
				data.admin = true;
				data.contentEditable = true;
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