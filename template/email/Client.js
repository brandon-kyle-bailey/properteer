const nodemailer = require("nodemailer");
require('dotenv').config();

class Client {
    constructor(options={}) {
        this.transporter = nodemailer.createTransport(options);
        this.mailObject = {};
    }

    /**
     * @param {String} emailFrom
     */
    set from(emailFrom) {
        this.mailObject['from'] = emailFrom;
    }

    /**
     * @param {String} emailTo
     */
    set to(emailTo) {
        this.mailObject['to'] = emailTo;
    }

    /**
     * @param {String} emailSubject
     */
    set subject(emailSubject) {
        this.mailObject['subject'] = emailSubject;
    }

    /**
     * @param {String} emailHtml
     */
    set html(emailHtml) {
        this.mailObject['html'] = emailHtml;
    }

    /**
     * @param {String} emailText
     */
    set text(emailText) {
        this.mailObject['text'] = emailText;
    }

    /**
     * @param {Array<Object>} emailAttachments
     */
    set attachments(emailAttachments) {
        this.mailObject['attachments'] = emailAttachments;
    }

    constructCidObject(data) {
        return `cid:${data}`;
    }

    /**
     * @param {String} from
     * @param {String} to
     * @param {String} subject
     * @param {String} text
     * @param {String} html
     * @param {Array<Object>} attachments
     */
    createMailObject(from="", to="", subject="", text="", html="", attachments=[]) {
        this.mailObject = {
            from,
            to,
            subject,
            text,
            html,
            attachments
        }

    }

    async sendEmail() {
        try {
            const sentObject = await this.transporter.sendMail(this.mailObject);
            console.log(`Email sent: ${sentObject.response}`);
        } catch(error) {
            console.log(error);
        }
    }
}

module.exports = Client;