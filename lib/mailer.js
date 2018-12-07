var nodemailer = require('nodemailer');
var config = require('./mailer-config.json');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('lib/.aws-config.json');

// MAILER
const smtpConfig = {
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
        user: config.AWS_MAIL.SMTP_USER,
        pass: config.AWS_MAIL.SMTP_PASS
    }
};
const transport = nodemailer.createTransport(smtpConfig);

// DYNAMO DB
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

module.exports = {
    confirm : function(req, res){
        var name = req.body.name;
        var email = req.body.email;
        var type = req.body.type;
        if(type == "contribute"){
            sayHello(req, res);
        }else{
            subscribeToMaillist(req, res);
        }
    }
}


function subscribeToMaillist(req, res){
    var putItemParams = {
      TableName: 'ocean-mailing',
      Item: {
        userId : {S: req.body.email} ,
        userName: {S: req.body.name} ,
        signUpDate: {S: new Date().toISOString()},
      }
    };

    // params to look for existing email in DB
    var getItemParams = {
        TableName: 'ocean-mailing',
        Key: {
            "userId": { S: req.body.email }
        }
    };

    // check if email already exists
    dynamodb.getItem(getItemParams, (err, data) => {
      if(err) {
        res.json({error: 'Could not load items: ' + err.message});
      } else {
        if (data.Item) {
          res.json({error: 'email already exists', url: req.url, body: req.body});
        } else {
            // save email in DB
             dynamodb.putItem(putItemParams, (err, data) => {
               if(err) {
                 res.json({error: err, url: req.url, body: req.body});
               } else {
                res.sendStatus(200)
                sendConfirmation(req);
               }
             });
        }
    }
    })
}

function sendConfirmation(req, isContribute){
    if(isContribute){
        var message = `Dear ${req.body.name}, \n\n Thanks for your email, our acquisition team will get in touch soon. \n\n\n — ocean archive \n\n\n ${req.body.subject} \n\n ${req.body.message}`
        var subject = `recieved confirmation`
    }else{
        var message = `Dear ${req.body.name}, \n\n Thanks for your interest, stay tuned! \n\n\n — ocean archive team`
        var subject = `ocean archive subscribed`
    }

    var mailOption = {
      from: `"ocean archive" <${config.MAIL.INFO}>`, // replace this email with @oceanarchive.org
      to: req.body.email,
      subject: subject,
      text: message
    }

    transport.sendMail(mailOption);
}


function sayHello(req, res){
    // the amazon one
    var message = `${req.body.message} \n\n\nFrom: ${req.body.name}\nEmail: ${req.body.email}`
    var mailOption = {
      from: `"oceanarchive.io" <${config.MAIL.INFO}>`,
      to: config.MAIL.ADDRESS, // change this later to config.MAIL.INFO
      subject: `HOLDING inquiry: ${req.body.subject}`,
      text: message
    }

    transport.sendMail(mailOption, function(error, info){
      if(error){
        res.json({error: 'error sending to archive@tba21.org'});
      }else{
        sendConfirmation(req, true)
        res.sendStatus(200)
      };
    });
}
