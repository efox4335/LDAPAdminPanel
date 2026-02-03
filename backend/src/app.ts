import express from 'express';

import ldapDbRouter from './routes/ldapdb';
import settingsRouter from './routes/settings';
import { loggerMiddleware } from './middlewares/loggers';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

app.use('/ldapdbs', ldapDbRouter);
app.use('/settings', settingsRouter);

app.use(errorHandler);

export default app;
