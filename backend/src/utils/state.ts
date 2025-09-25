//all server state will be stored here
import ldapts from 'ldapts';

import { storedClientMetaData } from './types';

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

//eventually settings like this will be read from a settings file and will be settable from the frontend
export let logOutputFile: string;

if (process.env.LOG_FILE) {
  logOutputFile = process.env.LOG_FILE;
} else {
  logOutputFile = 'stdout';
}

export let enableLogs: boolean;

if (process.env.ENABLE_LOGGING) {
  enableLogs = true;
} else {
  enableLogs = false;
}
