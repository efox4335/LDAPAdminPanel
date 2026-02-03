import express from 'express';

import ldapDbRouter from './routes/ldapdb';
import settingsRouter from './routes/settings';
import { loggerMiddleware } from './middlewares/loggers';
import errorHandler from './middlewares/errorHandler';
import getDefaultSettings from './utils/getDefaultSettings';
import { setDefaultSettings } from './utils/state';

const app = express();

const iniDefaultSettings = async () => {
  if (process.env.DEFAULT_SETTINGS_FILE) {
    const defaultSettings = await getDefaultSettings(process.env.DEFAULT_SETTINGS_FILE);

    setDefaultSettings(defaultSettings);
  } else {
    setDefaultSettings({});
  }
};

void iniDefaultSettings();

app.use(express.json());

app.use(loggerMiddleware);

app.use('/ldapdbs', ldapDbRouter);
app.use('/settings', settingsRouter);

app.use(errorHandler);

export default app;
