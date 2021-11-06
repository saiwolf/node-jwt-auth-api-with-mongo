import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from '../_config';
import Logger from '../_middleware/logger';

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== 'test') {
    transport
        .verify()
        .then(() => Logger.info("Connected to email server..."))
        .catch(() => Logger.warn("Unable to connect to email server."));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to: string, subject: string, text: string): Promise<SMTPTransport.SentMessageInfo> => {
    const msg = { from: config.email.from, to, subject, text };
    return await transport.sendMail(msg);
};

export default sendEmail