import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { memo, useState } from 'react';
import { useDispatch } from 'react-redux';

import getDisplayDc from '../utils/getDisplayDc';
import { selectLdapEntry, addOpenEntry } from '../slices/client';
import LdapEntryVisibilityToggle from './LdapEntryVisibilityToggle';

const LdapTreeEntry = memo(({ id, lastVisibleDn, entryDn, offset }: { id: string, lastVisibleDn: string, entryDn: string, offset: number }) => {
  const entry = useSelector((state) => selectLdapEntry(state, id, entryDn));

  const [isVisible, setIsVisible] = useState<boolean>(true);

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

  if (!isVisible) {
    return (
      <div className='ldapTreeEntry' style={{ paddingLeft: `${offset}px` }}>
        <LdapEntryVisibilityToggle isVisible={isVisible} setIsVisible={setIsVisible} />
        dc: {displayDc}
      </div>
    );
  }

  const handleOpenEntry = () => {
    dispatch(addOpenEntry({ clientId: id, entryDn: entryDn }));
  };

  return (
    <div className='ldapTreeEntry' style={{ paddingLeft: `${offset}px` }}>
      <LdapEntryVisibilityToggle isVisible={isVisible} setIsVisible={setIsVisible} />
      <button className='openEntryButton' type='button' onClick={handleOpenEntry}>
        {displayDc}
      </button>

      <div className='ldapTreeEntryChildren'>
        {childDns.map((childDn) => {
          return (
            <LdapTreeEntry key={childDn} id={id} lastVisibleDn={childLastVisibleDn} entryDn={childDn} offset={offset + 5} />
          );
        })}
      </div>
    </div>
  );
});

const LdapTree = ({ id }: { id: string }) => {
  return (
    <div className='ldapTreeRoot'>
      <LdapTreeEntry id={id} lastVisibleDn='' entryDn='dse' offset={5} />
    </div>
  );
};

export default LdapTree;
