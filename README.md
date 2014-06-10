popcms
======

NodeJS, MongoDB website content management system



Example use:
============








var popcms = require("popcms");


popcms.createServer({
 
	templatePath : __dirname + '/html',

	staticFilePath :  __dirname + '/static',
 
	host : "127.0.0.1",

	port : "5000",

	adminEmail : "me@googlemailbox.com", // admin account to use with Google Auth
	
	secret : "RANDOM_STRING",

	connString :  "mongodb://UserName:Password@DbHost:DbPort/DbName",

	
	sendgrid: 
		{

			username: "SENDGRID_USERNAME",

			password: "SENDGRID_PASSWORD",
	
		contactMailTo: "CONTACT_FORM_TO_ADDRESS",
	
		contactMailFrom: "CONTACT_FORM_FROM_ADDRESS",
	
		contactSubject: "CONTACT_FORM_SUBJECT"
 
	
	}
	
});
