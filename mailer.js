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

module.exports.email  = async (event, context, callback) => {
    let body = JSON.parse(event.body);
    let type = body.type;
    try {
        if (type === "collaboration") {
            await collaboration(body);
        } else {
            await updates(body);
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

async function sendConfirmation(body, isContribution){

    var message, subject;
    if (isContribution) {
        message = `Dear ${body.name}, \n\n Thanks for your interest in collaborating with the Ocean Archive team. We will respond to you promptly. If you received this email in error please let us know by replying to this email.`
        subject = `ocean archive collaboration request received`
    } else {
        message = `Dear ${body.name}, \n\n Thanks for your interest in receiving updates from the Ocean Archive. If you received this email in error please let us know by replying to this email. `
        subject = `ocean archive updates request received`
    }

    var mailOption = {
      from: `"ocean-archive.org" <${process.env.MAIL_INFO}>`, // replace this email with @oceanarchive.org
      to: body.email,
      subject: subject,
      text: message
    }

    try {
        await transport.sendMail(mailOption);
    } catch (err) {
        console.log(err);
    }    
}

async function collaboration(body) {
    // the amazon one
    var message = `${body.message} \n\n\nFrom: ${body.name}\nInstitution: ${body.institution}\nLocation: ${body.location}\nEmail: ${body.email}`
    var mailOption = {
      from: `"ocean-archive.org" <${process.env.MAIL_INFO}>`,
      to: process.env.MAIL_ADDRESS,
      subject: `Collaboration inquiry from ${body.name}`,
      text: message
    }
    // 'error sending to archive@tba21.org'
    try {
        let mailArchive = await transport.sendMail(mailOption);
        let mailSubmitter = await sendConfirmation(body, true);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function updates(body) {
    // the amazon one
    var message = `Updates request \n\n\nFrom: ${body.name}\nEmail: ${body.email}`
    var mailOption = {
      from: `"ocean-archive.org" <${process.env.MAIL_INFO}>`,
      to: process.env.MAIL_ADDRESS, 
      subject: `Updates request`,
      text: message
    }
    try {
        await transport.sendMail(mailOption);
        await sendConfirmation(body, false); // false as not a collaboration request
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}
