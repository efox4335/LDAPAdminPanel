import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { useAppDispatch as useDispatch } from '../utils/reduxHooks';
import { memo, useState, type SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

import getDisplayDc from '../utils/getDisplayDc';
import { concatEntryMap, selectLdapEntry, updateEntry } from '../slices/client';
import LdapEntryDisplay from './LdapEntryDisplay';
import NewEntryForm from './NewEntryForm';
import { modifyEntry, modifyEntryDn } from '../services/ldapdbsService';
import { delEntry } from '../slices/client';
import { addError } from '../slices/error';
import type { ldapAttribute, modifyReq, newLdapAttribute } from '../utils/types';
import NewAttributeList from './NewAttributeList';
import parseModifyedAttributes from '../utils/parseModifiedAttributes';
import { fetchLdapEntry, fetchLdapSubtree } from '../utils/query';
import generateLdapServerTree from '../utils/generateLdapServerTree';
import getParentDn from '../utils/getParentDn';
import DelEntryForm from './DelEntryForm';

const LdapTreeEntry = memo(({ id, lastVisibleDn, entryDn, offset }: { id: string, lastVisibleDn: string, entryDn: string, offset: number }) => {
  const entry = useSelector((state) => selectLdapEntry(state, id, entryDn));

  const [modifiedAttributes, setModifiedAttributes] = useState<newLdapAttribute[]>([]);
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [newDn, setNewDn] = useState<string>('');

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

  const handleModifyToggle = () => {
    if (!isModifying) {
      setNewDn(entry.dn);

      setModifiedAttributes(
        Object
          .entries(entry.entry)
          .filter(([key]) => key !== 'dn')
          .map(([key, value]) => {
            return {
              id: uuidv4(),
              attributeName: key,
              values: (Array.isArray(value)) ?
                value.map((val) => {
                  return { id: uuidv4(), value: val };
                }) :
                [{ id: uuidv4(), value: value }]
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

      if (modifyOp.changes.length > 0) {
        await modifyEntry(id, modifyOp);

        const res = await fetchLdapEntry(id, entryDn);

        dispatch(updateEntry({ clientId: id, entry: res.visibleEntry, operationalEntry: res.operationalEntry }));
      }

      setIsModifying(false);
      setModifiedAttributes([]);

      //runs after seemingly redundant fetch and dispatch because if modifyEntryDn throws but modifyEntry does not the entry will have outdated info
      if (newDn !== entry.dn) {
        await modifyEntryDn(id, {
          dn: entry.dn,
          newDN: newDn
        });

        const rawSubtree = await fetchLdapSubtree(id, newDn);

        const formattedSubtree = generateLdapServerTree(rawSubtree, newDn);

        dispatch(concatEntryMap({ clientId: id, parentDn: getParentDn(newDn), subtreeRootDn: newDn, entryMap: formattedSubtree }));
        dispatch(delEntry({ clientId: id, dn: entry.dn }));
      }
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
          dn:
          <input value={newDn} onChange={(event) => setNewDn(event.target.value)} />
          {newDn === entry.dn ? <></> :
            <button type='button' onClick={() => setNewDn(entry.dn)}>reset</button>}
          <NewAttributeList newAttributes={modifiedAttributes} setNewAttributes={setModifiedAttributes} />
          <button>save</button>
        </form> :
        <>entry: <LdapEntryDisplay attributes={displayAttributes} /></>}

      <button onClick={handleModifyToggle}>
        {isModifying ? 'cancel' : 'modify'}
      </button>
      <NewEntryForm id={id} parentDn={entryDn} />
      <DelEntryForm clientId={id} entryDn={entryDn} />
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
