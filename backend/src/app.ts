import express from 'express';

import ldapDbRouter from './routes/ldapdb';
import { loggerMiddleware } from './middlewares/loggers';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

app.use('/ldapdbs', ldapDbRouter);

app.use(errorHandler);

export default app;
