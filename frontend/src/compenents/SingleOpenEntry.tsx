import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { closeOpenEntry } from '../slices/client';
import { addError } from '../slices/error';
import CloseButton from './CloseButton';
import type { serverTreeEntry, ldapAttribute, openEntryState } from '../utils/types';
import ModifyEntryForm from './ModifyEntryForm';
import DelEntryForm from './DelEntryForm';
import LdapEntryDisplay from './LdapEntryDisplay';
import NewEntryForm from './NewEntryForm';

const OpenEntryDisplay = ({ clientId, entry }: { clientId: string, entry: Extract<serverTreeEntry, { visible: true }> }) => {
  const [entryState, setEntryState] = useState<openEntryState>('display');

  const displayAttributes: ldapAttribute[] = Object
    .entries(entry.entry)
    .concat(Object
      .entries(entry.operationalEntry)
      .filter(([key]) => key !== 'dn')
    )
    .map(([key, value]) => {
      return { name: key, values: value };
    });

  switch (entryState) {
    case 'display':
      return (
        <div>
          <LdapEntryDisplay attributes={displayAttributes} />
          <button onClick={() => setEntryState('delete')} className='negativeButton'>delete</button>
          <button onClick={() => setEntryState('newEntry')} className='positiveButton'>new child</button>
          <button onClick={() => setEntryState('modify')} className='positiveButton'>modify</button>
          <br></br>
          <br></br>
        </div>
      );
    case 'delete':
      return (
        <DelEntryForm entryDn={entry.dn} clientId={clientId} cancelDel={() => setEntryState('display')} />
      );
    case 'modify':
      return (
        <ModifyEntryForm hideForm={() => setEntryState('display')} entry={entry} clientId={clientId} />
      );
    case 'newEntry':
      return (
        <NewEntryForm clientId={clientId} parentDn={entry.dn} cancelNewEntry={() => setEntryState('display')} />
      );
  }
};

const SingleOpenEntry = ({ clientId, entry }: { clientId: string, entry: serverTreeEntry }) => {
  const dispatch = useDispatch();

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

  return (
    <div className='singleOpenEntry'>
      <CloseButton onClick={handleCloseEntry} />
      <OpenEntryDisplay clientId={clientId} entry={entry} />
    </div>
  );
};

export default SingleOpenEntry;
