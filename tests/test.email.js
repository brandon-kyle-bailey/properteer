const MailClient = require('../template/email/Client');

const client = new MailClient(options = {
    host: process.env.APP_MAIL_HOST,
    port: 465,
    secure: true, // use TLS
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
}
);

client.createMailObject(
    from=`"Properteer" <${process.env.APP_EMAIL}>`, 
    to=`${process.env.APP_EMAIL}`, 
    subject="Properteer | New property alert!", 
    text="test",
    html="<h1>test</h1>", 
    attachments=[]);

client.sendEmail();