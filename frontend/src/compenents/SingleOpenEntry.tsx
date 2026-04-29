import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { v4 as uuid } from 'uuid';

import { addOpenEntry, closeOpenEntry, selectLdapEntry } from '../slices/server';
import { addError } from '../slices/error';
import CloseButton from './CloseButton';
import type { ldapAttribute, openLdapEntry } from '../utils/types';
import ModifyEntryForm from './ModifyEntryForm';
import DelEntryForm from './DelEntryForm';
import LdapEntryDisplay from './LdapEntryDisplay';
import NewEntryForm from './NewEntryForm';

type openExistingEntryState = 'display' | 'modify' | 'delete';

const OpenExistingEntryDisplay = ({ serverId, entryDn }: { serverId: string, entryDn: string }) => {
  const dispatch = useDispatch();

  const [entryState, setEntryState] = useState<openExistingEntryState>('display');

  const entry = useSelector((state) => selectLdapEntry(state, serverId, entryDn));

  if (!entry) {
    dispatch(addError(new Error(`entry ${entryDn} is not valid ldap entry`)));

    return (
      <div>
        invalid entry
      </div>
    );
  }

  if (!entry.visible) {
    dispatch(addError(new Error(`entry ${entry.dn} is not visible`)));

    return (
      <div>
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

  switch (entryState) {
    case 'display':
      return (
        <div>
          <LdapEntryDisplay attributes={displayAttributes} />
          <button onClick={() => setEntryState('delete')} className='negativeButton'>delete</button>
          <button onClick={() => {
            dispatch(addOpenEntry({
              serverId: serverId, entry: {
                entryType: 'newEntry',
                id: uuid(),
                initialAttributes: {
                  dn: [entryDn]
                }

              }
            }));
          }} className='positiveButton'>new child</button>
          <button onClick={() => setEntryState('modify')} className='positiveButton'>modify</button>
        </div>
      );
    case 'delete':
      return (
        <DelEntryForm entryDn={entry.dn} serverId={serverId} cancelDel={() => setEntryState('display')} />
      );
    case 'modify':
      return (
        <ModifyEntryForm hideForm={() => setEntryState('display')} entry={entry} serverId={serverId} />
      );
  }
};

const OpenNewEntryDisplay = ({ serverId, entry }: { serverId: string, entry: Extract<openLdapEntry, { entryType: 'newEntry' }> }) => {
  const dispatch = useDispatch();

  const cancelNewEntry = () => {
    dispatch(closeOpenEntry({ serverId: serverId, entry }));
  };

  return (
    <NewEntryForm serverId={serverId} defaultEntryAttributes={entry.initialAttributes} cancelNewEntry={cancelNewEntry} />
  );
};

const SingleOpenEntry = ({ serverId, entry }: { serverId: string, entry: openLdapEntry }) => {
  const dispatch = useDispatch();

  const handleCloseEntry = () => {
    dispatch(closeOpenEntry({ serverId: serverId, entry: entry }));
  };

  if (entry.entryType === 'existingEntry') {
    return (
      <div className='singleOpenEntry'>
        <CloseButton onClick={handleCloseEntry} />
        <OpenExistingEntryDisplay serverId={serverId} entryDn={entry.entryDn} />
      </div>
    );
  }

  if (entry.entryType === 'newEntry') {
    return (
      <div className='singleOpenEntry'>
        <CloseButton onClick={handleCloseEntry} />
        <OpenNewEntryDisplay serverId={serverId} entry={entry} />
      </div>
    );
  }
};

export default SingleOpenEntry;
