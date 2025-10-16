import { useState, type SyntheticEvent } from 'react';
import { useAppDispatch as useDispatch } from '../utils/reduxHooks';

import { addNewClient } from '../services/ldapdbsService';
import { addClient } from '../slices/client';
import { addError } from '../slices/error';
import type { client } from '../utils/types';

const NewClientForm = () => {
  const [newLdapUrl, setNewLdapUrl] = useState<string>('');

  const dispatch = useDispatch();

  const handleNewClient = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const newClientId = await addNewClient(newLdapUrl);

      const newClient: client = {
        id: newClientId.id,
        serverUrl: newLdapUrl,
        isConnected: false,
        openEntries: {},
        boundDn: null,
        entryMap: undefined
      };

      dispatch(addClient(newClient));

      setNewLdapUrl('');
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <div className='newClientForm'>
      <h3>Add new client: </h3>
      <form onSubmit={handleNewClient}>
        Server Url:
        <input value={newLdapUrl} onChange={(event) => setNewLdapUrl(event.target.value)} />
        <button>create</button>
      </form>
    </div>
  );
};

export default NewClientForm;
