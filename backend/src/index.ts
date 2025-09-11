import express from 'express';

import settingsRouter from './routes/settings';

const PORT = 3000;

const app = express();

app.use(express.json());

app.use('/settings', settingsRouter);

app.listen(PORT, () => {
  console.log(`backend up at port ${PORT}`);
});
