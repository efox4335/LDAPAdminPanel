import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { useAppDispatch as useDispatch } from '../utils/reduxHooks';
import { memo } from 'react';

import getDisplayDc from '../utils/getDisplayDc';
import { selectLdapEntry } from '../slices/client';
import LdapEntryDisplay from './LdapEntryDisplay';
import NewEntryForm from './NewEntryForm';
import { deleteEntry } from '../services/ldapdbsService';
import { delEntry } from '../slices/client';
import { addError } from '../slices/error';

const LdapTreeEntry = memo(({ id, lastVisibleDn, entryDn, offset }: { id: string, lastVisibleDn: string, entryDn: string, offset: number }) => {
  const entry = useSelector((state) => selectLdapEntry(state, id, entryDn));

  const dispatch = useDispatch();

  if (!entry) {
    console.log(`dn ${entryDn} does not exist in store`);

    return (
      <></>
    );
  }

  const childDns: string[] = Object.values(entry.children);
  const childLastVisibleDn = (entry.visible) ? entry.dn : lastVisibleDn;
  const displayDc = getDisplayDc(lastVisibleDn, entryDn);

  if (!entry.visible) {
    return (
      <>
        {childDns.map((childDn) => {
          return (
            <LdapTreeEntry key={childDn} id={id} lastVisibleDn={childLastVisibleDn} entryDn={childDn} offset={offset} />
          );
        })}
      </>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteEntry(id, { dn: entryDn });

      dispatch(delEntry({ clientId: id, dn: entryDn }));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <div style={{ paddingLeft: `${offset}px` }}>
      dc: {displayDc}
      <br></br>
      entry: <LdapEntryDisplay entry={entry.entry} />
      <button onClick={handleDelete}>delete</button>
      <NewEntryForm id={id} parentDn={entryDn} />
      <br></br>
      <br></br>

      {childDns.map((childDn) => {
        return (
          <LdapTreeEntry key={childDn} id={id} lastVisibleDn={childLastVisibleDn} entryDn={childDn} offset={offset + 5} />
        );
      })}
    </div>
  );
});

const LdapTree = ({ id }: { id: string }) => {
  return (
    <LdapTreeEntry id={id} lastVisibleDn='' entryDn='dse' offset={5} />
  );
};

export default LdapTree;
