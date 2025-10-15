import { useAppDispatch as useDispatch } from '../utils/reduxHooks';

import type { client } from '../utils/types';
import { deleteClient, unbindClient } from '../services/ldapdbsService';
import { delClient, addClient } from '../slices/client';
import { addError } from '../slices/error';
import LdapTree from './LdapTree';
import generateLdapServerTree from '../utils/generateLdapServerTree';
import { fetchAllLdapEntries } from '../utils/query';
import BindForm from './BindForm';
import Exop from './Exop';

const SingleClient = ({ client }: { client: client }) => {
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
    <div className='singleClient'>
      <div className='singleClientHeader'>
        <div className='singleClientMetadata'>
          <h4>server name</h4>
          Server Url: {client.serverUrl}
          <br></br>
          Bound DN: {boundDn}
          <br></br>
          {connectionString}
          <br></br>

          <button onClick={handleUnbind}>unbind</button>
          <button onClick={handleDelete}>remove</button>
        </div>
        <Exop clientId={client.id} />
        <BindForm client={client} />
      </div>
      {(!client.entryMap || !('dse' in client.entryMap)) ? <></> : <div className='ldapTreeContainer'><LdapTree id={client.id} /></div>}
    </div>
  );
};

export default SingleClient;
