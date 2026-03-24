import { setLogOutputFile, setEnableLogs, defaultSettings } from './state';

const applySettings = (curSettings: Record<string, unknown>) => {
  if (curSettings.logging !== undefined && typeof (curSettings.logging) === 'object') {
    const logObj = curSettings.logging as Record<string, unknown>;

    if (logObj.logFile !== undefined && typeof (logObj.logFile) === 'string') {
      setLogOutputFile(logObj.logFile);
    }

    if (logObj.enableLogging !== undefined && typeof (logObj.enableLogging) === 'boolean') {
      setEnableLogs(logObj.enableLogging);
    }
  } else if (defaultSettings.logging !== undefined && typeof (defaultSettings.logging) === 'object') {
    const logObj = defaultSettings.logging as Record<string, unknown>;

    if (logObj.logFile !== undefined && typeof (logObj.logFile) === 'string') {
      setLogOutputFile(logObj.logFile);
    }

    if (logObj.enableLogging !== undefined && typeof (logObj.enableLogging) === 'boolean') {
      setEnableLogs(logObj.enableLogging);
    }
  }
};

export default applySettings;
