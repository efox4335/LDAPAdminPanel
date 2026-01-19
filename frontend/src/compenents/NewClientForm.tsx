import { useState, type SyntheticEvent } from 'react';
import { useAppDispatch as useDispatch } from '../utils/reduxHooks';

import { addNewClient } from '../services/ldapdbsService';
import { addClient } from '../slices/client';
import { addError } from '../slices/error';
import type { client } from '../utils/types';

const NewClientForm = () => {
  const [newLdapUrl, setNewLdapUrl] = useState<string>('');

  const dispatch = useDispatch();

  const resetForm = () => {
    setNewLdapUrl('');
  };

  const handleNewClient = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const newClientId = await addNewClient(newLdapUrl);

      const newClient: client = {
        id: newClientId.id,
        serverUrl: newLdapUrl,
        isConnected: false,
        openEntries: [],
        openEntryMap: {},
        boundDn: null,
        entryMap: undefined
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
