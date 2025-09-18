import express from 'express';

import ldapDbRouter from './routes/ldapdb';
import { loggerMiddleware } from './middlewares/loggers';

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

app.use('/ldapdbs', ldapDbRouter);

export default app;
