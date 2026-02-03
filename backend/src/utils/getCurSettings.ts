import { writeFile, readFile } from 'node:fs/promises';

import { settingsFile, defaultSettings } from './state';

const getCurSettings = async (): Promise<Record<string, unknown>> => {
  let settings;

  const stringDefaults = JSON.stringify(defaultSettings, null, ' ');

  try {
    settings = await readFile(settingsFile, { encoding: 'utf8' });
  } catch {
    await writeFile(settingsFile, stringDefaults);

    settings = JSON.stringify(defaultSettings, null, ' ');
  }

  if (settings === '') {
    await writeFile(settingsFile, stringDefaults);

    settings = JSON.stringify(defaultSettings, null, ' ');
  }

  return JSON.parse(settings) as Record<string, unknown>;
};

export default getCurSettings;
