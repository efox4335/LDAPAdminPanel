import { useAppDispatch as useDispatch } from '../utils/reduxHooks';
import { useState } from 'react';

import type { client } from '../utils/types';
import { deleteClient, unbindClient } from '../services/ldapdbsService';
import { delClient, addClient, addSchemas } from '../slices/client';
import { addError } from '../slices/error';
import LdapTree from './LdapTree';
import generateLdapServerTree from '../utils/generateLdapServerTree';
import { fetchLdapEntry } from '../utils/query';
import BindForm from './BindForm';
import Exop from './Exop';
import OpenEntries from './OpenEntries';
import SearchForm from './SearchForm';
import SchemaDisplay from './SchemaDisplay';
import fetchSchemas from '../utils/fetchSchemas';

const SingleClient = ({ client }: { client: client }) => {
  const [fetchedTree, setFetchedTree] = useState<boolean>(false);
  const [fetchedSchemas, setFetchedSchemas] = useState<boolean>(false);

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
        openEntries: [],
        openEntryMap: {},
        attributeTypeSchemas: undefined,
        originalObjectClassSchemas: undefined,
        inheritedObjectClassSchemas: undefined,
        isConnected: false,
        boundDn: null,
        entryMap: undefined
      };

      dispatch(addClient(newClient));

      setFetchedTree(false);
      setFetchedSchemas(false);
    } catch (err) {
      dispatch(addError(err));
    }
  };

  const fetchServerTree = async () => {
    try {
      const dse = await fetchLdapEntry(client.id, '');

      const entryMap = generateLdapServerTree([dse], '');

      const newClient: client = {
        ...client,
        entryMap: entryMap
      };

      dispatch(addClient(newClient));
    } catch (err) {
      dispatch(addError(err));
    } finally {
      setFetchedTree(true);
    }
  };

  if (client.isConnected && !fetchedTree) {
    void fetchServerTree();
  }

  const fetchAndAddSchemas = async () => {
    try {
      setFetchedSchemas(true);

      if (!client.entryMap) {
        return;
      }

      const dse = client.entryMap['dse'];

      if (dse === undefined) {
        return;
      }

      if (!dse.visible) {
        console.log('dse is not visible');

        return;
      }

      const schemaDn = dse.operationalEntry['subschemaSubentry'];

      if (schemaDn === undefined || Array.isArray(schemaDn)) {
        dispatch(addError(new Error('dse has no subschemaSubentry')));

        return;
      }

      const schemas = await fetchSchemas(schemaDn, client.id);

      dispatch(addSchemas({
        clientId: client.id,
        attributeTypeMap: schemas.attributeTypeMap,
        initialObjectClassMap: schemas.originalObjectClassMap,
        inheritedObjectClassMap: schemas.inheritedObjectClassMap
      }));
    } catch (err) {
      dispatch(addError(err));

      return;
    }
  };

  if (fetchedTree && !fetchedSchemas) {
    void fetchAndAddSchemas();
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
                  <tr>
                    <td>
                      tls enabled
                    </td>
                    <td>
                      {client.tlsEnabled.toString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className='userInteractionButtons'>
            <button onClick={handleDelete} className={client.isConnected ? '' : 'negativeButton'}>remove</button>
            {client.isConnected ?
              <button onClick={handleUnbind} className='negativeButton'>unbind</button> :
              <></>
            }
          </div>
        </div>
        <BindForm client={client} />
        {client.boundDn !== null ?
          <SearchForm clientId={client.id} /> :
          <></>
        }
        <Exop clientId={client.id} />
      </div>
      <br></br>
      {(!client.entryMap || !('dse' in client.entryMap)) ? <></> : <div className='ldapTreeContainer'>
        <LdapTree clientId={client.id} />
        <OpenEntries clientId={client.id} />
      </div>}
      <br></br>
      <SchemaDisplay clientId={client.id} />
    </div>
  );
};

export default SingleClient;
