var express = require('express'); 
var content = require('./content');
var passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy;

var config = {}; 
  
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

exports.helloWorld = function(){
    return "Hello, World";
};

exports.createServer = function(settings) {
    
	config = settings; 
	
    var server = express();  
    server.use(express.cookieParser()); 
    server.use(express.bodyParser());
    server.use(express.session({ secret: config.secret })); 
    server.use(passport.initialize());
    server.use(passport.session());
    
	 
	 /* Handle static files*/
    server.use('/css', express.static(__dirname + '/static/css'));
    server.use('/img', express.static(__dirname + '/static/img'));
    server.use('/fonts', express.static(__dirname + '/static/fonts'));
    server.use('/js', express.static(__dirname + '/static/js'));
    server.get('/robots.txt', function(req, res){
		res.sendfile(__dirname + '/static/robots.txt');
	});
	
    server.get('/auth/google', passport.authenticate('google'));
	/* Handle google authenication (return from google) */
    server.get('/auth/google/return', 
        passport.authenticate('google', { successRedirect: '/',
                                        failureRedirect: '/login' })); 
                        
    /* Handle logout */
    server.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });     
	
	content.setConfig({templatePath : settings.templatePath});
	
	/* the default: check for page in db*/
    server.get('*', content.getPage);
    
	var port = Number(process.env.PORT || settings.port);
	server.listen(port, function() {
		settings.port = port;
	  console.log("Listening on " + port);
	});  
	
	
	passport.serializeUser(function(user, done) {
	  done(null, user);
	}); 
	passport.deserializeUser(function(user, done) {
	  done(null, user);
	}); 
	passport.use(new GoogleStrategy({
	   returnURL: 'http://' + config.host + ':' + config.port + '/auth/google/return',
	   realm: 'http://' + config.host + ':'+ config.port + '/'

	  },
	  function(id, profile, done) { 
		  var User = {"openId":id, emailAddress: profile.emails[0].value, "displayName": profile.displayName}; 
		  if(User.emailAddress===config.adminEmail)
		  {
			done(false, User);
		  }
		  else
		  {
			  console.log("Invalid user login attempt by '" + User.emailAddress + "'.");
			return done(null, false, { message: 'Invalid user account.' });
		  } 
	  }
	));  
    
}; 
 