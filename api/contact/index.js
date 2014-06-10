
var sendgrid;
// define the routes for /api/users
var config;
module.exports = function attachHandlers(router) {
    // get requests 
    router.post('/api/contact/', send);
    this.config = router.config;

    sendgrid = require('sendgrid')(config.sendgrid.username, config.sendgrid.password);
};


function send(req, res) {

    if (req.body == null) {
        res.statusCode = 400;
        console.log("body missing");
        return res.send({ "message": 'Error 400: Body missing.' });
    }

    if (!req.body.hasOwnProperty('Message') ||
        !req.body.hasOwnProperty('Phone') ||
        !req.body.hasOwnProperty('Email') ||
        !req.body.hasOwnProperty('Name')) {
        console.log("content missing");
        res.statusCode = 400;
        return res.send({ "message": 'Error 400: Post syntax incorrect.' });
    }


    if (req.body.Message.toLowerCase().indexOf("<a ") >= 0) {
        console.log("html content");
        res.statusCode = 400;
        return res.send({ "message": 'Error 400: Html contained in message.' });
    }



    sendgrid.send({
        "to": config.sendgrid.contactMailTo,
        "from": config.sendgrid.contactMailFrom,
        "subject": config.sendgrid.contactSubject,
        "text": req.body.Message + "\n\n Phone: " + req.body.Phone + "\n\nEmail: " + req.body.Email + "\n\nName: " + req.body.Name
    }, function (err, json) {
        console.error("Err: " + err);
        console.error("json: " + json);
        if (err) {
            console.error(err);
            return res.send(500);
        }
        else {
            console.log(json);
            res.statusCode = 200;
            return res.send(json);
        }
    });
}
