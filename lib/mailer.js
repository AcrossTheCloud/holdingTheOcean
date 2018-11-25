var nodemailer = require('nodemailer');
var config = require('lib/mailer-config.json');
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
    saveEmail : function(req, res){

        var name = req.body.name;
        var email = req.body.email;

        var putItemParams = {
          TableName: 'ocean-mailing',
          Item: {
            userId : {S: email} ,
            userName: {S: name} ,
            signUpDate: {S: new Date().toISOString()}

          }
        };

        // params to look for existing email in DB
        var getItemParams = {
            TableName: 'ocean-mailing',
            Key: {
                "userId": { S: email }
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
                     sendConfirmation(email, name, res);
                   }
                 });
            }
        }
        })
    }
}

function sendConfirmation(email, name, res){
    var message = `Dear ${name}, \n\n Thanks for your interest, stay tuned! \n\n\n — ocean archive team`
    var mailOption = {
      from: `"ocean archive" <${config.MAIL.INFO}>`, // replace this email with @oceanarchive.org
      to: email,
      subject: `ocean archive subscribed`,
      text: message
    }
    transport.sendMail(mailOption, function(error, info){
        if(error) {
          res.json({error: error, url: req.url, body: req.body});
        } else {
          res.json({success: 'email subscribed!', url: req.url, data: data})
        }
    });
}
