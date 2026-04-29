import { useDispatch } from 'react-redux';
import { useState, type SyntheticEvent } from 'react';

import { deleteEntry } from '../services/ldapdbsService';
import { closeOpenEntry, delEntry } from '../slices/server';
import { addError } from '../slices/error';
import type { newControlObject } from '../utils/types';
import NewLdapControls from './NewLdapControls';
import getControls from '../utils/getControls';
import AdvancedDropdown from './AdvancedDropdown';

const DelEntryForm = ({ entryDn, serverId, cancelDel }: { entryDn: string, serverId: string, cancelDel: () => void }) => {
  const dispatch = useDispatch();

  const [newControls, setNewControls] = useState<newControlObject[]>([]);

  const handleDelete = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      await deleteEntry(serverId, { dn: entryDn, control: getControls(newControls) });

      dispatch(closeOpenEntry({ serverId: serverId, entry: { entryType: 'existingEntry', entryDn } }));
      dispatch(delEntry({ serverId: serverId, dn: entryDn }));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <b>delete {entryDn} forever</b>
      <br></br>
      <AdvancedDropdown displayText='advanced options'>
        <NewLdapControls tableName='controls' newControls={newControls} setNewControls={setNewControls} />
      </AdvancedDropdown>
      <button type='submit' className='negativeButton'>delete</button>
      <button type='button' className='positiveButton' onClick={() => cancelDel()}>cancel</button>
    </form>
  );
};

export default DelEntryForm;
