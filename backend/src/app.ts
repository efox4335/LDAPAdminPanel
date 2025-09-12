import express from 'express';

import settingsRouter from './routes/settings';
import ldapDbRouter from './routes/ldapdb';

const app = express();

app.use(express.json());

app.use('/settings', settingsRouter);
app.use('/ldapdb', ldapDbRouter);

export default app;
