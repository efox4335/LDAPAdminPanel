import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { memo, useState } from 'react';

import getDisplayDc from '../utils/getDisplayDc';
import { selectLdapEntry } from '../slices/client';
import LdapEntryDisplay from './LdapEntryDisplay';
import NewEntryForm from './NewEntryForm';
import type { ldapAttribute } from '../utils/types';
import DelEntryForm from './DelEntryForm';
import ModifyEntryForm from './ModifyEntryForm';

const LdapTreeEntry = memo(({ id, lastVisibleDn, entryDn, offset }: { id: string, lastVisibleDn: string, entryDn: string, offset: number }) => {
  const entry = useSelector((state) => selectLdapEntry(state, id, entryDn));

  const [isModifying, setIsModifying] = useState<boolean>(false);

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
    <div style={{ paddingLeft: `${offset}px` }}>
      dc: {displayDc}
      <br></br>
      {isModifying ?
        <ModifyEntryForm isFormVisible={isModifying} hideForm={() => setIsModifying(false)} entry={entry} clientId={id} /> :
        <>entry: <LdapEntryDisplay attributes={displayAttributes} /></>}

      <button onClick={() => setIsModifying(!isModifying)}>
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
