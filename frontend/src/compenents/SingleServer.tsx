import { useAppDispatch as useDispatch } from '../utils/reduxHooks';
import { useState } from 'react';

import type { server } from '../utils/types';
import { deleteServer, unbindServer } from '../services/ldapdbsService';
import { delServer, addServer, addSchemas } from '../slices/server';
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

const SingleServer = ({ server }: { server: server }) => {
  const [fetchedTree, setFetchedTree] = useState<boolean>(false);
  const [fetchedSchemas, setFetchedSchemas] = useState<boolean>(false);

  const dispatch = useDispatch();

  const boundDn = (server.boundDn === null) ? 'null' : server.boundDn;

  const connectionString = (server.isConnected) ? 'connected' : 'not connected';

  const handleDelete = async () => {
    try {
      await deleteServer(server.id);

      dispatch(delServer(server.id));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  const handleUnbind = async () => {
    try {
      await unbindServer(server.id);

      const newServer: server = {
        ...server,
        openEntries: [],
        openEntryMap: {},
        attributeTypeSchemas: undefined,
        originalObjectClassSchemas: undefined,
        inheritedObjectClassSchemas: undefined,
        isConnected: false,
        boundDn: null,
        entryMap: undefined
      };

      dispatch(addServer(newServer));

      setFetchedTree(false);
      setFetchedSchemas(false);
    } catch (err) {
      dispatch(addError(err));
    }
  };

  const fetchServerTree = async () => {
    try {
      const dse = await fetchLdapEntry(server.id, '');

      const entryMap = generateLdapServerTree([dse], '');

      const newServer: server = {
        ...server,
        entryMap: entryMap
      };

      dispatch(addServer(newServer));
    } catch (err) {
      dispatch(addError(err));
    } finally {
      setFetchedTree(true);
    }
  };

  if (server.isConnected && !fetchedTree) {
    void fetchServerTree();
  }

  const fetchAndAddSchemas = async () => {
    try {
      setFetchedSchemas(true);

      if (!server.entryMap) {
        return;
      }

      const dse = server.entryMap['dse'];

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

      const schemas = await fetchSchemas(schemaDn, server.id);

      dispatch(addSchemas({
        serverId: server.id,
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
    <div className='singleServer'>
      <div className='singleServerHeader'>
        <div className='singleServerMetadata'>
          <div>
            <h4>server info</h4>
            <div className='userInteractionContainer'>
              <table>
                <tbody>
                  <tr className='headlessFirstTableRow'>
                    <td>
                      server url
                    </td>
                    <td>
                      {server.serverUrl}
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
                      {server.tlsEnabled.toString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className='userInteractionButtons'>
            <button onClick={handleDelete} className={server.isConnected ? '' : 'negativeButton'}>remove</button>
            {server.isConnected ?
              <button onClick={handleUnbind} className='negativeButton'>unbind</button> :
              <></>
            }
          </div>
        </div>
        <BindForm server={server} />
        {server.boundDn !== null ?
          <SearchForm serverId={server.id} /> :
          <></>
        }
        <Exop serverId={server.id} />
      </div>
      <br></br>
      {(!server.entryMap || !('dse' in server.entryMap)) ? <></> : <div className='ldapTreeContainer'>
        <LdapTree serverId={server.id} />
        <OpenEntries serverId={server.id} />
      </div>}
      {(!server.entryMap || !('dse' in server.entryMap)) ? <></> : <>
        <br></br>
        <SchemaDisplay serverId={server.id} />
      </>}

    </div>
  );
};

export default SingleServer;
