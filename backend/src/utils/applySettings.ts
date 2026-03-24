import { setLogOutputFile, setEnableLogs, defaultSettings, setForceTls, setCustomCertificateAuthorities } from './state';

const locateSetting = (settingsObject: Record<string, unknown>, path: string[]): unknown => {
  let curLocation: Record<string, unknown> = settingsObject;

  let curPathPart = 0;

  for (const part of path) {
    if (curLocation[part] !== undefined) {
      if (curPathPart + 1 === path.length) {
        return curLocation[part];
      } else if (typeof (curLocation[part]) === 'object') {
        curLocation = curLocation[part] as Record<string, unknown>;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }

    curPathPart += 1;
  }
};

const getCurSettingOrDefault = (settingsObject: Record<string, unknown>, path: string[]): unknown => {
  const curSetting = locateSetting(settingsObject, path);

  if (curSetting === undefined) {
    return locateSetting(defaultSettings, path);
  }

  return curSetting;
};

const applySettings = (curSettings: Record<string, unknown>) => {
  const curLogFile = getCurSettingOrDefault(curSettings, ['logging', 'logFile']);

  if (typeof (curLogFile) === 'string') {
    setLogOutputFile(curLogFile);
  }

  const curEnableLogging = getCurSettingOrDefault(curSettings, ['logging', 'enableLogging']);

  if (typeof (curEnableLogging) === 'boolean') {
    setEnableLogs(curEnableLogging);
  }

  const curForceTls = getCurSettingOrDefault(curSettings, ['tls', 'forceTls']);

  if (typeof (curForceTls) === 'boolean') {
    setForceTls(curForceTls);
  }

  const curCustomCertificateAuthorities = getCurSettingOrDefault(curSettings, ['tls', 'customCertificateAuthorities']);

  if (Array.isArray(curCustomCertificateAuthorities) &&
    curCustomCertificateAuthorities.reduce((allPrevAreString: boolean, cert) => allPrevAreString && typeof (cert) === 'string', true)) {
    setCustomCertificateAuthorities(curCustomCertificateAuthorities as string[]);
  }
};

export default applySettings;
