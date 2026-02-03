//all server state will be stored here
import ldapts from 'ldapts';

import { storedClientMetaData } from './types';
import getDefaultSettings from '../utils/getDefaultSettings';
import getCurSettings from '../utils/getCurSettings';

const clients = new Map<string, storedClientMetaData>();
let newClientId: number = 0;

export const addNewClient = (client: ldapts.Client, serverUrl: string): string => {
  const currentClientId = newClientId.toString();
  newClientId += 1;

  const newClient: storedClientMetaData = {
    id: currentClientId,
    ldapClient: client,
    serverUrl: serverUrl,
    boundDn: null
  };

  clients.set(currentClientId, newClient);

  return currentClientId;
};

export const getClientById = (clientId: string): ldapts.Client | undefined => {
  const client: storedClientMetaData | undefined = clients.get(clientId);

  if (client === undefined) {
    return client;
  }

  return client.ldapClient;
};

export const removeClientById = (clientId: string) => {
  clients.delete(clientId);
};

export const getStoredClientMetaDataById = (clientId: string): storedClientMetaData | undefined => {
  return clients.get(clientId);
};

export const setBoundDnById = (clientId: string, newBoundDn: string | null) => {
  const client = clients.get(clientId);

  if (client === undefined) {
    throw new Error('tried to set bound dn with invalid client id');
  }

  client.boundDn = newBoundDn;
};

export const getAllStoredClientMetaData = (): storedClientMetaData[] => {
  return [...clients.entries()].map(([_key, value]) => value);
};

export let settingsFile: string;

export const setSettingsFile = (newSettingsFile: string) => {
  settingsFile = newSettingsFile;
};

export let defaultSettings: Record<string, unknown>;

export const setDefaultSettings = (newDefault: Record<string, unknown>) => {
  defaultSettings = newDefault;
};

export let logOutputFile: string = 'stdout';

export const setLogOutputFile = (newLogFile: string) => {
  logOutputFile = newLogFile;
};

export let enableLogs: boolean = false;

export const setEnableLogs = (newEnableLogs: boolean) => {
  enableLogs = newEnableLogs;
};

export const initializeState = async () => {
  if (process.env.DEFAULT_SETTINGS_FILE) {
    defaultSettings = await getDefaultSettings(process.env.DEFAULT_SETTINGS_FILE);
  } else {
    defaultSettings = {};
  }

  if (process.env.SETTINGS_FILE) {
    settingsFile = process.env.SETTINGS_FILE;
  } else {
    settingsFile = './config/ldapAdminPanelSettings.json';
  }

  await getCurSettings();

};
