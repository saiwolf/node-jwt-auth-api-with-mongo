import mongoose, { ConnectOptions } from 'mongoose';
import app from './app';
import config from './config';
import Logger from './_middleware/logger';

let server: any;
try {
    const mongooseOptions: ConnectOptions = {
        autoIndex: true,
        autoCreate: true,
    };
    mongoose.connect(config.mongoose.url, mongooseOptions).then(() => {
        Logger.info('Connected to MongoDB\n');
        server = app.listen(process.env.PORT, () => {
            Logger.info(`Server is up and running @ http://localhost:${config.port}`);
        });
    });
} catch (err: any) {
    Logger.error(err);
}

const exitHandler = () => {
    if (server) {
        Logger.info('Server closed');
        process.exit(1);
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: any) => {
    Logger.error(error);
    exitHandler();
}

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    Logger.info('SIGTERM receivied');
    process.exit(1);
});