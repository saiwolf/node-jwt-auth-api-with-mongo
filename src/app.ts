import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import helmet from 'helmet';
import morganMiddleware from './_middleware/morgan';


import usersController from './controllers/user.controller';
import postsController from './controllers/post.controller';
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
app.use('/api/v1/users', usersController);
app.use('/api/v1/posts', postsController);

// swagger docs route
app.use('/api/v1/docs', swaggerDocs);

// 404 on missing routes
app.use('*', function (_, res) {
    res.sendStatus(404).end();
});

// global error handler
app.use(errorHandler);

export default app;