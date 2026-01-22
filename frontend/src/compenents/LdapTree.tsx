import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { memo } from 'react';
import { useDispatch } from 'react-redux';

import getDisplayDc from '../utils/getDisplayDc';
import { selectLdapEntry, addOpenEntry, concatEntryMap, collapseEntry, expandEntry } from '../slices/client';
import LdapEntryVisibilityToggle from './LdapEntryVisibilityToggle';
import { fetchLdapChildren, fetchLdapEntry } from '../utils/query';
import { addError } from '../slices/error';
import generateLdapServerTree from '../utils/generateLdapServerTree';
import getParentDn from '../utils/getParentDn';
import type { queryFetchRes } from '../utils/types';

const LdapTreeEntry = memo(({ clientId, lastVisibleDn, entryDn }: { clientId: string, lastVisibleDn: string, entryDn: string }) => {
  const entry = useSelector((state) => selectLdapEntry(state, clientId, entryDn));

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

  const isExpanded = entry.isExpanded;

  const handleOpenEntry = () => {
    dispatch(addOpenEntry({ clientId: clientId, entry: { entryType: 'existingEntry', entryDn } }));
  };

  const handleExpandEntry = async () => {
    try {
      let baseEntry;

      let childEntries: queryFetchRes[] = [];

      if (entryDn === 'dse') {
        baseEntry = await fetchLdapEntry(clientId, '');

        const namingContexts = entry.operationalEntry.namingContexts;

        if (typeof (namingContexts) === 'string') {
          childEntries = [await fetchLdapEntry(clientId, namingContexts)];
        } else {
          for (const rootDitDn of namingContexts) {
            const rootDit = await fetchLdapEntry(clientId, rootDitDn);

            childEntries.push(rootDit);
          }
        }
      } else {
        baseEntry = await fetchLdapEntry(clientId, entryDn);

        childEntries = await fetchLdapChildren(clientId, entryDn);
      }

      const formattedEntries = generateLdapServerTree([...childEntries, baseEntry], entryDn);

      const curEntry = formattedEntries[entryDn];

      if (!curEntry || curEntry.visible === false) {
        return;
      }

      curEntry.isExpanded = true;

      const parentDn = getParentDn(curEntry.dn);

      dispatch(concatEntryMap({ clientId: clientId, parentDn: parentDn, subtreeRootDn: curEntry.dn, entryMap: formattedEntries }));

      dispatch(expandEntry({ clientId, entryDn }));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  const handleCollapseEntry = () => {
    dispatch(collapseEntry({ clientId: clientId, entryDn: entryDn }));
  };

  if (!isExpanded) {
    return (
      <div className='ldapTreeEntry'>
        <LdapEntryVisibilityToggle isVisible={isExpanded} toggleIsVisible={handleExpandEntry} />
        <button className='openEntryButton' type='button' onClick={handleOpenEntry}>
          {displayDc}
        </button>
      </div>
    );
  }

  return (
    <div className='ldapTreeEntry'>
      <LdapEntryVisibilityToggle isVisible={isExpanded} toggleIsVisible={handleCollapseEntry} />
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
