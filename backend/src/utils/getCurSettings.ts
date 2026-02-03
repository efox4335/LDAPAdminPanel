import { writeFile, readFile } from 'node:fs/promises';

import { settingsFile, defaultSettings, setLogOutputFile, setEnableLogs } from './state';

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

  if (curSettings.logging && typeof (curSettings.logging) === 'object') {
    const logObj = curSettings.logging as Record<string, unknown>;

    if (logObj.logFile && typeof (logObj.logFile) === 'string') {
      setLogOutputFile(logObj.logFile);
    }

    if (logObj.enableLogging && typeof (logObj.enableLogging) === 'boolean') {
      setEnableLogs(logObj.enableLogging);
    }
  }

  return curSettings;
};

export default getCurSettings;
