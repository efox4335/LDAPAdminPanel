import { useDispatch } from 'react-redux';
import { useState, type SyntheticEvent } from 'react';

import { deleteEntry } from '../services/ldapdbsService';
import { closeOpenEntry, delEntry } from '../slices/client';
import { addError } from '../slices/error';
import type { newControlObject } from '../utils/types';
import NewLdapControls from './NewLdapControls';
import getControls from '../utils/getControls';

const DelEntryForm = ({ entryDn, clientId, cancelDel }: { entryDn: string, clientId: string, cancelDel: () => void }) => {
  const dispatch = useDispatch();

  const [showDelControls, setShowDelControls] = useState<boolean>(false);
  const [newControls, setNewControls] = useState<newControlObject[]>([]);

  const handleDelete = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      await deleteEntry(clientId, { dn: entryDn, control: getControls(newControls) });

      dispatch(closeOpenEntry({ clientId: clientId, entryDn: entryDn }));
      dispatch(delEntry({ clientId: clientId, dn: entryDn }));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <form onSubmit={handleDelete}>
      delete {entryDn} forever
      <br></br>
      <button type='submit' className='negativeButton'>delete</button>
      <button type='button' className='positiveButton' onClick={() => cancelDel()}>cancel</button>
      <button type='button' onClick={() => setShowDelControls(!showDelControls)}>
        {showDelControls ? <>cancel</> : <>add delete controls</>}
      </button>
      {showDelControls ?
        <>
          <br></br>
          <br></br>
          <NewLdapControls tableName='controls' newControls={newControls} setNewControls={setNewControls} />
        </> : <></>}
    </form>
  );
};

export default DelEntryForm;
