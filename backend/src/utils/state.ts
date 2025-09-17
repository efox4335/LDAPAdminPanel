//all server state will be stored here
import ldapts from 'ldapts';

const clients = new Map<string, ldapts.Client>();
let newClientId: number = 0;

export const addNewClient = (client: ldapts.Client): string => {
  const currentClientId = newClientId.toString();
  newClientId += 1;

  clients.set(currentClientId, client);

  return currentClientId;
};

export const getClientById = (clientId: string): ldapts.Client | undefined => {
  return clients.get(clientId);
};

export const removeClientById = (clientId: string) => {
  clients.delete(clientId);
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
