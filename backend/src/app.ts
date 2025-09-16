import express from 'express';

import ldapDbRouter from './routes/ldapdb';

const app = express();

app.use(express.json());

app.use('/ldapdbs', ldapDbRouter);

export default app;
