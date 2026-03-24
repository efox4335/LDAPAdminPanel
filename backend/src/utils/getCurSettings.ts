import { writeFile, readFile } from 'node:fs/promises';

import { settingsFile, defaultSettings } from './state';
import applySettings from './applySettings';

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

  const curSettings = JSON.parse(settings) as Record<string, unknown>;

  applySettings(curSettings);

  return curSettings;
};

export default getCurSettings;
