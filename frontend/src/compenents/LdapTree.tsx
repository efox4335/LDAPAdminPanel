import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { useAppDispatch as useDispatch } from '../utils/reduxHooks';
import { memo, useState, type SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

import getDisplayDc from '../utils/getDisplayDc';
import { selectLdapEntry, updateEntry } from '../slices/client';
import LdapEntryDisplay from './LdapEntryDisplay';
import NewEntryForm from './NewEntryForm';
import { deleteEntry, modifyEntry } from '../services/ldapdbsService';
import { delEntry } from '../slices/client';
import { addError } from '../slices/error';
import type { ldapAttribute, modifyReq, newLdapAttribute } from '../utils/types';
import NewAttributeList from './NewAttributeList';
import parseModifyedAttributes from '../utils/parseModifiedAttributes';
import { fetchLdapEntry } from '../utils/query';

const LdapTreeEntry = memo(({ id, lastVisibleDn, entryDn, offset }: { id: string, lastVisibleDn: string, entryDn: string, offset: number }) => {
  const entry = useSelector((state) => selectLdapEntry(state, id, entryDn));

  const [modifiedAttributes, setmodifiedAttributes] = useState<newLdapAttribute[]>([]);
  const [isModifying, setIsModifying] = useState<boolean>(false);

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

  const handleModifyToggle = () => {
    if (!isModifying) {
      setmodifiedAttributes(
        Object
          .entries(entry.entry)
          //todo: support modifyDn to remove filter
          .filter(([key]) => key !== 'dn')
          .map(([key, value]) => {
            return {
              id: uuidv4(),
              attributeName: key,
              value: (Array.isArray(value)) ? value.join(',') : value
            };
          })
      );
    }

    setIsModifying(!isModifying);
  };

  const displayAttributes: ldapAttribute[] = Object
    .entries(entry.entry)
    .concat(Object
      .entries(entry.operationalEntry)
      .filter(([key]) => key !== 'dn')
    )
    .map(([key, value]) => {
      return { name: key, values: value };
    });

  const handleUpdate = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const modifyOp: modifyReq = parseModifyedAttributes(modifiedAttributes, entry.entry);

      await modifyEntry(id, modifyOp);

      const res = await fetchLdapEntry(id, entryDn);

      dispatch(updateEntry({ clientId: id, entry: res.visibleEntry, operationalEntry: res.operationalEntry }));

      setIsModifying(false);
      setmodifiedAttributes([]);
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <div style={{ paddingLeft: `${offset}px` }}>
      dc: {displayDc}
      <br></br>
      {isModifying ?
        <form onSubmit={handleUpdate}>
          <NewAttributeList newAttributes={modifiedAttributes} setNewAttributes={setmodifiedAttributes} />
          <button>save</button>
        </form> :
        <>entry: <LdapEntryDisplay attributes={displayAttributes} /></>}

      <button onClick={handleModifyToggle}>
        {isModifying ? 'cancel' : 'modify'}
      </button>
      <NewEntryForm id={id} parentDn={entryDn} />
      <button onClick={handleDelete}>delete</button>
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
