import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
import { ConnectOptions } from 'mongoose';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        APP_SECRET: Joi.string().required().description('Secret key for cookie'),
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(3000),
        MONGODB_URL: Joi.string().required().description('Mongo DB url'),
        MONGODB_USER: Joi.string().description('Mongo DB user'),
        MONGODB_PASS: Joi.string().description('Mongo DB pass'),
        SMTP_HOST: Joi.string().description('server that will send the emails'),
        SMTP_PORT: Joi.number().description('port to connect to the email server'),
        SMTP_USERNAME: Joi.string().description('username for email server'),
        SMTP_PASSWORD: Joi.string().description('password for email server'),
        SMTP_AUTH: Joi.boolean().description('Does the SMTP host require authentication?'),
        SMTP_AUTH_TYPE: Joi.string().description('SMTP Auth mecanism'),
        EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const mongooseConfigOptions: ConnectOptions = {
    autoIndex: true,
    autoCreate: true
}

const emailConfigOptions = {
    smtp: {
        host: envVars.SMTP_HOST,
        port: envVars.SMTP_PORT,
        auth_type: envVars.SMTP_AUTH_TYPE.toLower(),
        auth: {},
    },
    from: envVars.EMAIL_FROM,
}

if (envVars.SMTP_AUTH) {
    Object.assign(emailConfigOptions.smtp.auth, {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
    });
}

if (envVars.MONGODB_USER && envVars.MONGODB_PASS) {
    Object.assign(mongooseConfigOptions, {
        authSource: "admin",
        user: envVars.MONGODB_USER,
        pass: envVars.MONGODB_PASS,
    })
}

export default {
    env: envVars.NODE_ENV,
    app: {
        secret: envVars.APP_SECRET,
    },
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        options: mongooseConfigOptions,
    },
    email: emailConfigOptions,
};