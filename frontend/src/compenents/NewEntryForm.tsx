import { useState, type SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';

import type { addReq, newLdapAttribute, newLdapAttributeValue, newControlObject } from '../utils/types';
import { addNewEntry } from '../services/ldapdbsService';
import { addEntry } from '../slices/client';
import { addError } from '../slices/error';
import getAttributeValues from '../utils/getAttributeValues';
import NewAttributeList from './NewAttributeList';
import { fetchLdapEntry } from '../utils/query';
import NewLdapAttributeValues from './NewLdapAttributeValues';
import getControls from '../utils/getControls';
import NewLdapControls from './NewLdapControls';

const NewEntryForm = ({ clientId, parentDn, cancelNewEntry }: { clientId: string, parentDn: string, cancelNewEntry: () => void }) => {
  const [newDc, setNewDc] = useState<string>('');
  const [newObjectClasses, setNewObjectClasses] = useState<newLdapAttributeValue[]>([]);
  const [newAttributes, setNewAttributes] = useState<newLdapAttribute[]>([]);

  const [newControls, setNewControls] = useState<newControlObject[]>([]);

  const dispatch = useDispatch();

  const handleAddEntry = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const newAttributeValues: Record<string, string[]> = {};
      newAttributes
        .filter((_ele, index) => index !== newAttributes.length - 1)
        .forEach((ele) => newAttributeValues[ele.attributeName] = getAttributeValues(ele.values));

      const newDn = `${newDc},${parentDn}`;

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
        parentDn: parentDn,
        entry: res.visibleEntry,
        operationalEntry: res.operationalEntry
      }));

      //intentionally does not delete user input on error
      setNewDc('');
      setNewObjectClasses([]);
      setNewAttributes([]);
      setNewControls([]);
    } catch (err) {
      dispatch(addError(err));
    }
  };

  const handleRestet = () => {
    setNewDc('');
    setNewObjectClasses([]);
    setNewAttributes([]);
    setNewControls([]);
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
                dc
              </td>
              <td>
                <input value={newDc} onChange={(event) => setNewDc(event.target.value)} />
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
        <br></br>
        <NewLdapControls tableName='controls' newControls={newControls} setNewControls={setNewControls} />

        <button type='button' onClick={() => cancelNewEntry()} className='negativeButton'>cancel</button>
        <button type='button' onClick={() => handleRestet()} className='negativeButton'>reset</button>
        <button type='submit' className='positiveButton'>add</button>
      </form>

    </div >
  );
};

export default NewEntryForm;
