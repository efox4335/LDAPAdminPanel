import { useAppSelector as useSelector } from '../utils/reduxHooks';

import getDisplayDc from '../utils/getDisplayDc';
import { selectLdapEntry } from '../slices/client';

const LdapTree = ({ id, lastVisibleDn, entryDn }: { id: string, lastVisibleDn: string, entryDn: string }) => {
  const entry = useSelector((state) => selectLdapEntry(state, id, entryDn));

  if (!entry) {
    console.log(`dn ${entryDn} does not exist in store`);

    return (
      <></>
    );
  }

  const childDns: string[] = Object.values(entry.children);
  const childLastVisibleDn = (entry.visible) ? entry.dn : lastVisibleDn;
  const displayDc = getDisplayDc(lastVisibleDn, entryDn);

  return (
    <div>
      dc: {displayDc}
      <br></br>
      {(entry.visible) ?
        <>entry: {JSON.stringify(entry.entry)}</>
        : <></>}
      <br></br>

      <ul>
        {childDns.map((childDn) => {
          return (
            <li key={childDn}>
              <LdapTree id={id} lastVisibleDn={childLastVisibleDn} entryDn={childDn} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LdapTree;
