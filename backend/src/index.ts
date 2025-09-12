import express from 'express';

import settingsRouter from './routes/settings';
import ldapDbRouter from './routes/ldapdb';

const PORT = 3000;

const app = express();

app.use(express.json());

app.use('/settings', settingsRouter);
app.use('/ldapdb', ldapDbRouter);

app.listen(PORT, () => {
  console.log(`backend up at port ${PORT}`);
});
