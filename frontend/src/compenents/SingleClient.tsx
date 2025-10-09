import { useState, type SyntheticEvent } from 'react';
import { useAppDispatch as useDispatch } from '../utils/reduxHooks';

import type { bindReq, client } from '../utils/types';
import { deleteClient, bindClient, unbindClient } from '../services/ldapdbsService';
import { delClient, addClient } from '../slices/client';
import { addError } from '../slices/error';
import LdapTree from './LdapTree';
import generateLdapServerTree from '../utils/generateLdapServerTree';
import { fetchAllLdapEntries } from '../utils/query';

const SingleClient = ({ client }: { client: client }) => {
  const [newDn, setNewDn] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const dispatch = useDispatch();

  const boundDn = (client.boundDn === null) ? 'null' : client.boundDn;

  const connectionString = (client.isConnected) ? 'connected' : 'not connected';

  const handleDelete = async () => {
    try {
      await deleteClient(client.id);

      dispatch(delClient(client.id));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  const handleBind = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const req: bindReq = {
        dnOrSaslMechanism: newDn,
        password: (newPassword === '') ? undefined : newPassword
      };

      setNewDn('');
      setNewPassword('');

      await bindClient(client.id, req);

      const newClient = {
        ...client,
        isConnected: true,
        boundDn: req.dnOrSaslMechanism
      };

      dispatch(addClient(newClient));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  const handleUnbind = async () => {
    try {
      await unbindClient(client.id);

      const newClient: client = {
        ...client,
        isConnected: false,
        boundDn: null,
        entryMap: undefined
      };

      dispatch(addClient(newClient));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  const fetchServerTree = async () => {
    try {
      const entryArr = await fetchAllLdapEntries(client.id);

      const entryMap = generateLdapServerTree(entryArr, '');

      const newClient: client = {
        ...client,
        entryMap: entryMap
      };

      dispatch(addClient(newClient));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  if (client.isConnected && !client.entryMap) {
    void fetchServerTree();
  }

  return (
    <div>
      Server Url: {client.serverUrl}
      <br></br>
      Bound DN: {boundDn}
      <br></br>
      {connectionString}
      <br></br>
      <h4>bind: </h4>
      <form onSubmit={handleBind}>
        Dn:
        <input value={newDn} onChange={(event) => setNewDn(event.target.value)} />
        <br></br>
        password:
        <input type='password' value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
        <button>bind</button>
      </form>
      <br></br>
      <button onClick={handleUnbind}>unbind</button>
      <button onClick={handleDelete}>remove</button>
      <br></br>
      {(!client.entryMap || !('dse' in client.entryMap)) ? <></> : <LdapTree id={client.id} />}
    </div>
  );
};

export default SingleClient;
