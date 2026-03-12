import type { Dispatch, SetStateAction } from 'react';

import NewLdapAttributeValues from './NewLdapAttributeValues';
import NewAttributeList from './NewAttributeList';
import type { newLdapAttributeValue, newLdapAttribute } from '../utils/types';

const LdapEntryInput = (
  {
    newDn,
    setNewDn,
    newObjectClasses,
    setNewObjectClasses,
    newAttributes,
    setNewAttributes
  }: {
    newDn: string,
    setNewDn: Dispatch<SetStateAction<string>>,
    newObjectClasses: newLdapAttributeValue[],
    setNewObjectClasses: Dispatch<SetStateAction<newLdapAttributeValue[]>>,
    newAttributes: newLdapAttribute[],
    setNewAttributes: Dispatch<SetStateAction<newLdapAttribute[]>>
  }
) => {

  return (
    <table>
      <thead>
        <tr>
          <th scope='row'>attribute</th>
          <th scope='row'>value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            dn
          </td>
          <td>
            <input value={newDn} onChange={(event) => setNewDn(event.target.value)} />
          </td>
        </tr>
        <tr>
          <td>
            objectClass
          </td>
          <td>
            <NewLdapAttributeValues newValues={newObjectClasses} setNewValues={setNewObjectClasses} />
          </td>
        </tr>
        <NewAttributeList newAttributes={newAttributes} setNewAttributes={setNewAttributes} />
      </tbody>
    </table>
  );
};

export default LdapEntryInput;
