import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { closeOpenEntry } from '../slices/client';
import { addError } from '../slices/error';
import CloseButton from './CloseButton';
import type { serverTreeEntry, ldapAttribute } from '../utils/types';
import ModifyEntryForm from './ModifyEntryForm';
import DelEntryForm from './DelEntryForm';
import LdapEntryDisplay from './LdapEntryDisplay';
import NewEntryForm from './NewEntryForm';

const SingleOpenEntry = ({ clientId, entry }: { clientId: string, entry: serverTreeEntry }) => {
  const dispatch = useDispatch();

  const [isModifying, setIsModifying] = useState<boolean>(false);

  const handleCloseEntry = () => {
    dispatch(closeOpenEntry({ clientId: clientId, entryDn: entry.dn }));
  };

  if (!entry.visible) {
    dispatch(addError(new Error(`entry ${entry.dn} is not visible`)));

    return (
      <div className='singleOpenEntry'>
        <CloseButton onClick={handleCloseEntry} />
        entry is not visible
      </div>
    );
  }

  const displayAttributes: ldapAttribute[] = Object
    .entries(entry.entry)
    .concat(Object
      .entries(entry.operationalEntry)
      .filter(([key]) => key !== 'dn')
    )
    .map(([key, value]) => {
      return { name: key, values: value };
    });

  return (
    <div className='singleOpenEntry'>
      <CloseButton onClick={handleCloseEntry} />
      <br></br>
      {isModifying ?
        <ModifyEntryForm isFormVisible={isModifying} hideForm={() => setIsModifying(false)} entry={entry} clientId={clientId} /> :
        <>
          entry: <LdapEntryDisplay attributes={displayAttributes} />
          <button onClick={() => setIsModifying(!isModifying)} className='positiveButton'>
            modify
          </button>
        </>
      }

      {isModifying ? <></> : <>
        <NewEntryForm id={clientId} parentDn={entry.dn} />
        <DelEntryForm clientId={clientId} entryDn={entry.dn} />
      </>}
      <br></br>
      <br></br>
    </div>
  );
};

export default SingleOpenEntry;
