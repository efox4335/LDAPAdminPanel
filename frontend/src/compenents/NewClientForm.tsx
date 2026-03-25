import { useEffect, useState, type SyntheticEvent } from 'react';
import { useAppSelector as useSelector, useAppDispatch as useDispatch } from '../utils/reduxHooks';

import { addNewClient } from '../services/ldapdbsService';
import { selectSetting } from '../slices/settings';
import { addClient } from '../slices/client';
import { addError } from '../slices/error';
import type { client } from '../utils/types';

const NewClientForm = () => {
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

  const handleNewClient = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const newClientId = await addNewClient({
        url: newLdapUrl,
        enableTls: enableTls || /^ldaps.*/.test(newLdapUrl) || (forceTls ?? false)
      });

      const newClient: client = {
        id: newClientId.id,
        tlsEnabled: enableTls,
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

      dispatch(addClient(newClient));

      resetForm();
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <div className='newClientContainer'>
      <h3>Add New Client</h3>
      <form onSubmit={handleNewClient} className='newClientForm'>
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

export default NewClientForm;
