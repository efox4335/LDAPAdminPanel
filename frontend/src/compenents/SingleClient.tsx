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
import OpenEntries from './OpenEntries';

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
          <div>
            <h4>client info</h4>
            <div className='userInteractionContainer'>
              <table>
                <tbody>
                  <tr className='headlessFirstTableRow'>
                    <td>
                      server url
                    </td>
                    <td>
                      {client.serverUrl}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      bound dn
                    </td>
                    <td>
                      {boundDn}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {connectionString}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className='userInteractionButtons'>
            <button onClick={handleUnbind} className='negativeButton'>unbind</button>
            <button onClick={handleDelete} className='negativeButton'>remove</button>
          </div>
        </div>
        <BindForm client={client} />
        <Exop clientId={client.id} />
      </div>
      {(!client.entryMap || !('dse' in client.entryMap)) ? <></> : <div className='ldapTreeContainer'>
        <LdapTree clientId={client.id} />
        <OpenEntries clientId={client.id} />
      </div>}
    </div>
  );
};

export default SingleClient;
