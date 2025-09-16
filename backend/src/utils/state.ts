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
