import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { memo } from 'react';
import { useDispatch } from 'react-redux';

import getDisplayDc from '../utils/getDisplayDc';
import { selectLdapEntry, addOpenEntry, concatEntryMap, collapseEntry, expandEntry } from '../slices/server';
import LdapEntryVisibilityToggle from './LdapEntryVisibilityToggle';
import { fetchLdapChildren, fetchLdapEntry } from '../utils/query';
import { addError } from '../slices/error';
import generateLdapServerTree from '../utils/generateLdapServerTree';
import getParentDn from '../utils/getParentDn';
import type { queryFetchRes } from '../utils/types';

const LdapTreeEntry = memo(({ serverId, lastVisibleDn, entryDn }: { serverId: string, lastVisibleDn: string, entryDn: string }) => {
  const entry = useSelector((state) => selectLdapEntry(state, serverId, entryDn));

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
            <LdapTreeEntry key={childDn} serverId={serverId} lastVisibleDn={childLastVisibleDn} entryDn={childDn} />
          );
        })}
      </>
    );
  }

  const isExpanded = entry.isExpanded;

  const handleOpenEntry = () => {
    dispatch(addOpenEntry({ serverId: serverId, entry: { entryType: 'existingEntry', entryDn } }));
  };

  const handleExpandEntry = async () => {
    try {
      let baseEntry;

      let childEntries: queryFetchRes[] = [];

      if (entryDn === 'dse') {
        baseEntry = await fetchLdapEntry(serverId, '');

        const namingContexts = entry.operationalEntry.namingContexts;

        if (typeof (namingContexts) === 'string') {
          childEntries = [await fetchLdapEntry(serverId, namingContexts)];
        } else {
          for (const rootDitDn of namingContexts) {
            const rootDit = await fetchLdapEntry(serverId, rootDitDn);

            childEntries.push(rootDit);
          }
        }
      } else {
        baseEntry = await fetchLdapEntry(serverId, entryDn);

        childEntries = await fetchLdapChildren(serverId, entryDn);
      }

      const formattedEntries = generateLdapServerTree([...childEntries, baseEntry], entryDn);

      const curEntry = formattedEntries[entryDn];

      if (!curEntry || curEntry.visible === false) {
        return;
      }

      curEntry.isExpanded = true;

      const parentDn = getParentDn(curEntry.dn);

      dispatch(concatEntryMap({ serverId: serverId, parentDn: parentDn, subtreeRootDn: curEntry.dn, entryMap: formattedEntries }));

      dispatch(expandEntry({ serverId, entryDn }));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  const handleCollapseEntry = () => {
    dispatch(collapseEntry({ serverId: serverId, entryDn: entryDn }));
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
            <LdapTreeEntry key={childDn} serverId={serverId} lastVisibleDn={childLastVisibleDn} entryDn={childDn} />
          );
        })}
      </div>
    </div>
  );
});

const LdapTree = ({ serverId }: { serverId: string }) => {
  return (
    <div className='ldapTreeDisplayContainer'>
      <h4 className='ldapTreeDisplayHeader'>
        ldap tree
      </h4>
      <div className='userInteractionContainer'>
        <LdapTreeEntry serverId={serverId} lastVisibleDn='' entryDn='dse' />
      </div>
    </div>
  );
};

export default LdapTree;
