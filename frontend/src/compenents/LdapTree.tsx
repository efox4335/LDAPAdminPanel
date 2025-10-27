import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { memo, useState } from 'react';
import { useDispatch } from 'react-redux';

import getDisplayDc from '../utils/getDisplayDc';
import { selectLdapEntry, addOpenEntry } from '../slices/client';
import LdapEntryVisibilityToggle from './LdapEntryVisibilityToggle';

const LdapTreeEntry = memo(({ clientId, lastVisibleDn, entryDn }: { clientId: string, lastVisibleDn: string, entryDn: string }) => {
  const entry = useSelector((state) => selectLdapEntry(state, clientId, entryDn));

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
            <LdapTreeEntry key={childDn} clientId={clientId} lastVisibleDn={childLastVisibleDn} entryDn={childDn} />
          );
        })}
      </>
    );
  }

  const handleOpenEntry = () => {
    dispatch(addOpenEntry({ clientId: clientId, entryDn: entryDn }));
  };

  if (!isVisible) {
    return (
      <div className='ldapTreeEntry'>
        <LdapEntryVisibilityToggle isVisible={isVisible} setIsVisible={setIsVisible} />
        <button className='openEntryButton' type='button' onClick={handleOpenEntry}>
          {displayDc}
        </button>
      </div>
    );
  }

  return (
    <div className='ldapTreeEntry'>
      <LdapEntryVisibilityToggle isVisible={isVisible} setIsVisible={setIsVisible} />
      <button className='openEntryButton' type='button' onClick={handleOpenEntry}>
        {displayDc}
      </button>

      <div className='ldapTreeEntryChildren'>
        {childDns.map((childDn) => {
          return (
            <LdapTreeEntry key={childDn} clientId={clientId} lastVisibleDn={childLastVisibleDn} entryDn={childDn} />
          );
        })}
      </div>
    </div>
  );
});

const LdapTree = ({ clientId }: { clientId: string }) => {
  return (
    <div className='ldapTreeDisplayContainer'>
      <h4 className='ldapTreeDisplayHeader'>
        ldap tree
      </h4>
      <div className='userInteractionContainer'>
        <LdapTreeEntry clientId={clientId} lastVisibleDn='' entryDn='dse' />
      </div>
    </div>
  );
};

export default LdapTree;
