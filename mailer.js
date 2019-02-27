const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');

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

const headers = {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
};

// DynamoDB doc client
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports.optIn = async (event, context, callback) => {

    const body = JSON.parse(event).body;
    const key = uuidv1();

    const putItemParams = {
        TableName: process.env.EMAIL_TABLE,
        Item: {
            key:key,
            userName: body.name,
            email: body.email,
            confirmed: false
        }
    };
    try {
        await docClient.put(putItemParams).promise();

        const textMessage = `Dear ${body.name}, \n\n To confirm your subscription the ocean archive please visit https://localhost:5000/confirm.html?key=${key}`;
        const htmlMessage = `Dear ${body.name},<p>To confirm your subscription to the ocean archive please click on <a href="https://localhost:5000/confirm.html?key=${key}">this link</a>`;
        const subject = `confirm your subscription to the ocean archive`;

        var mailOption = {
            from: `"ocean archive" <${process.env.MAIL_INFO}>`, // replace this email with @oceanarchive.org
            to: body.email,
            subject: subject,
            text: textMessage,
            html: htmlMessage
        }

        let sendmail = await transport.sendMail(mailOption);

    } catch (error) {
        const response = {
            statusCode: 503,
            headers: headers,
            body: error.toString()
        }        
    }
}

module.exports.doubleOptIn = async (event, callback) => {
    
    // params to look for existing email in DB
    const getItemParams = {
        TableName: process.env.EMAIL_TABLE,
        Key: {
            "key": event.queryStringParameters.uuid
        }
    };

    let data = await docClient.get(getItemParams).promise();
    if (data.Item) {
        // save email in DB
        const putItemParams = {
            TableName: process.env.EMAIL_TABLE,
            Item: {
                key: data.Item.key,
                userName: data.Item.name,
                email: data.Item.email,
                confirmed: true,
                signUpDate: new Date().toISOString(),
            }
        };
        await docClient.put(putItemParams).promise();
        const response = {
            statusCode: 200,
            headers: headers,
            body: 'OK',
        };
        callback(response);
    }

}

module.exports.contribution = async (event, callback) => {

    try {
        const body = JSON.parse(event).body;

        let message = `${body.message} \n\n\nFrom: ${body.name}\nEmail: ${body.email}`;
        let mailOption = {
            from: `"oceanarchive.io" <${process.env.MAIL_INFO}>`,
            to: process.env.MAIL_ADDRESS, // change this later to config.MAIL.INFO
            subject: `HOLDING inquiry: ${body.subject}`,
            text: message
        }

        let sendmail = await transport.sendMail(mailOption);
        
        message = `Dear ${body.name}, \n\n Thanks for your email, our acquisition team will get in touch soon. \n\n\n — ocean archive \n\n\n ${body.subject} \n\n ${body.message}`
        subject = `recieved contribution confirmation`;

        let mailOption = {
            from: `"ocean archive" <${process.env.MAIL_INFO}>`, // replace this email with @oceanarchive.org
            to: body.email,
            subject: subject,
            text: message
        }

        let sendmail = await transport.sendMail(mailOption);
        
        const response = {
            statusCode: 200,
            headers: headers,
            body: 'OK',
        };

        callback(response);

    } catch (error) {

    }


    
}
