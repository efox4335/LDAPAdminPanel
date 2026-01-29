import { useState, type SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';

import type { addReq, newLdapAttribute, newLdapAttributeValue, newControlObject } from '../utils/types';
import { addNewEntry } from '../services/ldapdbsService';
import { addEntry, addOpenEntry } from '../slices/client';
import { addError } from '../slices/error';
import getAttributeValues from '../utils/getAttributeValues';
import NewAttributeList from './NewAttributeList';
import { fetchLdapEntry } from '../utils/query';
import NewLdapAttributeValues from './NewLdapAttributeValues';
import getControls from '../utils/getControls';
import NewLdapControls from './NewLdapControls';
import getParentDn from '../utils/getParentDn';
import AdvancedDropdown from './AdvancedDropdown';

const NewEntryForm = ({ clientId, defaultEntryAttributes, cancelNewEntry }: { clientId: string, defaultEntryAttributes: Record<string, string[]>, cancelNewEntry: () => void }) => {
  let defaultDn = '';

  if (defaultEntryAttributes['dn'] && defaultEntryAttributes['dn'][0]) {
    defaultDn = defaultEntryAttributes['dn'][0];
  }

  const [newDn, setNewDn] = useState<string>(defaultDn);

  let defaultObjectClass: newLdapAttributeValue[] = [];

  if (defaultEntryAttributes['objectClass'] && defaultEntryAttributes['objectClass'].length > 0) {
    defaultObjectClass = defaultEntryAttributes['objectClass'].map((objectClass) => {
      return {
        id: uuid(),
        value: objectClass
      };
    });
  }

  const [newObjectClasses, setNewObjectClasses] = useState<newLdapAttributeValue[]>(defaultObjectClass);

  const defaultAttributes: newLdapAttribute[] = Object.entries(defaultEntryAttributes)
    .filter(([key]) => {
      if (key === 'dn') {
        return false;
      }

      if (key == 'objectClass') {
        return false;
      }

      return true;
    })
    .map(([name, values]) => {
      return {
        id: uuid(),
        attributeName: name,
        values: values.map((val) => {
          return {
            id: uuid(),
            value: val
          };
        })
      };
    });

  const [newAttributes, setNewAttributes] = useState<newLdapAttribute[]>(defaultAttributes);

  const [newControls, setNewControls] = useState<newControlObject[]>([]);

  const dispatch = useDispatch();

  const handleReset = () => {
    setNewDn(defaultDn);
    setNewObjectClasses(defaultObjectClass);
    setNewAttributes(defaultAttributes);
    setNewControls([]);
  };

  const handleAddEntry = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const newAttributeValues: Record<string, string[]> = {};
      newAttributes
        .filter((_ele, index) => index !== newAttributes.length - 1)
        .forEach((ele) => newAttributeValues[ele.attributeName] = getAttributeValues(ele.values));

      const newEntry: addReq = {
        baseDn: newDn,
        entry: {
          ...newAttributeValues,
          objectClass: getAttributeValues(newObjectClasses)
        },
        control: getControls(newControls)
      };

      await addNewEntry(clientId, newEntry);
      const res = await fetchLdapEntry(clientId, newEntry.baseDn);

      dispatch(addEntry({
        clientId: clientId,
        parentDn: getParentDn(newDn),
        entry: res.visibleEntry,
        operationalEntry: res.operationalEntry
      }));

      dispatch(addOpenEntry({ clientId: clientId, entry: { entryType: 'existingEntry', entryDn: newDn } }));

      //intentionally does not delete user input on error
      handleReset();
      cancelNewEntry();
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <div>
      <form onSubmit={handleAddEntry}>
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

        <AdvancedDropdown displayText='advanced options'>
          <NewLdapControls tableName='controls' newControls={newControls} setNewControls={setNewControls} />
        </AdvancedDropdown>

        <button type='button' onClick={() => cancelNewEntry()} className='negativeButton'>cancel</button>
        <button type='button' onClick={() => handleReset()} className='negativeButton'>reset</button>
        <button type='submit' className='positiveButton'>add</button>
      </form>

    </div >
  );
};

export default NewEntryForm;
