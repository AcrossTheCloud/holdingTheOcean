const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');

// MAILER
const smtpConfig = {
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};
const transport = nodemailer.createTransport(smtpConfig);

const CORSHeaders = {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
};


// DYNAMO DB
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports.confirm  = async (event, context, callback) => {
    let body = JSON.parse(event.body);
    let type = body.type;
    try {
        if (type === "contribute") {
            await sayHello(body);
        } else {
            await subscribeToMaillist(body);
        }
        const response = {
            statusCode: 200,
            headers: CORSHeaders,
            body: JSON.stringify({"message": "OK"})
        }
        callback(null,response);
    } catch (error) {
        console.log(error);
        const response = {
            statusCode: 503,
            headers: CORSHeaders,
            body: JSON.stringify({ "message": "Server error " + error.toString() })
        };
        callback(null, response);
    }

}


async function subscribeToMaillist(body) {

    // params to look for existing email in DB
    const getItemParams = {
        TableName: process.env.EMAIL_TABLE,
        Key: {
            "userId": body.email
        }
    };

    let data = await docClient.get(getItemParams).promise();
    if (data.Item) {
        throw 'email already exists ' + body.email
    } else {
        // save email in DB
        const putItemParams = {
            TableName: process.env.EMAIL_TABLE,
            Item: {
                userId: body.email,
                userName: body.name,
                signUpDate: new Date().toISOString(),
            }
        };
        await docClient.put(putItemParams).promise();
        sendConfirmation(body);
    }
}

async function sendConfirmation(body, isContribute){
    if(isContribute){
        var message = `Dear ${body.name}, \n\n Thanks for your email, our acquisition team will get in touch soon. \n\n\n — ocean archive \n\n\n ${body.subject} \n\n ${body.message}`
        var subject = `recieved confirmation`
    }else{
        var message = `Dear ${body.name}, \n\n Thanks for your interest, stay tuned! \n\n\n — ocean archive team`
        var subject = `ocean archive subscribed`
    }

    var mailOption = {
      from: `"ocean archive" <${process.env.MAIL_INFO}>`, // replace this email with @oceanarchive.org
      to: body.email,
      subject: subject,
      text: message
    }

    let sendmail = await transport.sendMail(mailOption);
    
}

async function sayHello(body) {
    // the amazon one
    var message = `${body.message} \n\n\nFrom: ${body.name}\nEmail: ${body.email}`
    var mailOption = {
      from: `"ocean-archive.org" <${process.env.MAIL_INFO}>`,
      to: process.env.MAIL_ADDRESS, // change this later to config.MAIL.INFO
      subject: `HOLDING inquiry: ${body.subject}`,
      text: message
    }
    // 'error sending to archive@tba21.org'
    try {
        let sendmail = await transport.sendMail(mailOption);
        let confirmation = await sendConfirmation(body, true);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}
