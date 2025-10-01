import type { serverTreeEntry, displayChild } from '../utils/types';
import getDisplayableChildren from '../utils/getDisplayableChildren';

const LdapTree = ({ displayDc, entry }: { displayDc: string, entry: Extract<serverTreeEntry, { visible: true }> }) => {
  const children: displayChild[] = getDisplayableChildren(entry.dn, entry.children);

  return (
    <div>
      dc: {displayDc}
      <br></br>
      entry: {JSON.stringify(entry.entry)}
      <br></br>

      <ul>
        {children.map((child) => {
          return (
            <li key={child.entry.dn}>
              <LdapTree displayDc={child.displayDc} entry={child.entry} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LdapTree;
