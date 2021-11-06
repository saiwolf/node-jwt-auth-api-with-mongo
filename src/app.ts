import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import helmet from 'helmet';
import morganMiddleware from './_middleware/morgan';


import usersController from './controllers/user.controller';
import swaggerDocs from './_helpers/swagger';

import createTestUser from './_helpers/create-test-user';

const app = express();

// create test user in db on startup if required
createTestUser();

app.use(morganMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// api routes
app.use('/users', usersController);

// swagger docs route
app.use('/api-docs', swaggerDocs);

// global error handler
app.use(errorHandler);

export default app;