import { useEffect, useState, type SyntheticEvent } from 'react';
import { useAppSelector as useSelector, useAppDispatch as useDispatch } from '../utils/reduxHooks';

import { addNewServer } from '../services/ldapdbsService';
import { selectSetting } from '../slices/settings';
import { addServer } from '../slices/server';
import { addError } from '../slices/error';
import type { server } from '../utils/types';

const NewServerForm = () => {
  const [newLdapUrl, setNewLdapUrl] = useState<string>('');

  const rawForceTls = useSelector((state) => selectSetting(state, { path: ['tls', 'forceTls'] }));

  let forceTls: boolean = false;

  const [enableTls, setEnableTls] = useState<boolean>(forceTls);

  if (typeof (rawForceTls) === 'boolean') {
    forceTls = rawForceTls;
  }

  useEffect(() => {
    if (typeof (rawForceTls) === 'boolean' && rawForceTls) {
      setEnableTls(true);
    }
  }, [rawForceTls]);

  const dispatch = useDispatch();

  const resetForm = () => {
    setNewLdapUrl('');

    if (forceTls) {
      setEnableTls(true);
    } else {
      setEnableTls(false);
    }
  };

  const handleNewServer = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const isTlsOn = enableTls || /^ldaps.*/.test(newLdapUrl) || forceTls;

      const newServerId = await addNewServer({
        url: newLdapUrl,
        enableTls: isTlsOn
      });

      const newServer: server = {
        id: newServerId.id,
        tlsEnabled: isTlsOn,
        serverUrl: newLdapUrl,
        isConnected: false,
        openEntries: [],
        openEntryMap: {},
        boundDn: null,
        entryMap: undefined,
        attributeTypeSchemas: undefined,
        originalObjectClassSchemas: undefined,
        inheritedObjectClassSchemas: undefined
      };

      dispatch(addServer(newServer));

      resetForm();
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <div className='newServerContainer'>
      <h3>Add New Server</h3>
      <form onSubmit={handleNewServer} className='newServerForm'>
        <div className='userInteractionContainer'>
          <table>
            <tbody>
              <tr className='headlessFirstTableRow'>
                <td>
                  server url
                </td>
                <td>
                  <input value={newLdapUrl} onChange={(event) => setNewLdapUrl(event.target.value)} />
                </td>
              </tr>
              <tr>
                <td>
                  enable tls
                </td>
                <td>
                  <input className='criticalCheckbox' type='checkbox' checked={enableTls} onChange={() => setEnableTls(!enableTls || forceTls)} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='userInteractionButtons'>
          <button className='negativeButton' type='button' onClick={() => resetForm()}>reset</button>
          <button className='positiveButton'>add</button>
        </div>
      </form>
    </div>
  );
};

export default NewServerForm;
