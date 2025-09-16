//all server state will be stored here
import ldapts from 'ldapts';

const clients = new Map<number, ldapts.Client>();
let newClientId = 0;

export const addNewClient = (client: ldapts.Client): number => {
  const currentClientId = newClientId;
  newClientId += 1;

  clients.set(currentClientId, client);

  return currentClientId;
};

export const getClientById = (clientId: number): ldapts.Client | undefined => {
  return clients.get(clientId);
};

export const removeClientById = (clientId: number) => {
  clients.delete(clientId);
};
