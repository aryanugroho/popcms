var should = require('chai').should(),
    popcms = require('../index'),
    createServer = popcms.createServer;

describe('#createServer', function() {
  it('createServer', function() {
    createServer({
			templatePath : __dirname + '/html',
			staticFilePath :  __dirname + '/static', 
			host : "127.0.0.1",
			port : "5999",
			adminEmail : "test@test.com",
			secret : "nxfjkndkjlvnjkvnvndnv"
		}).should.equal(true);
  });
 
});
 