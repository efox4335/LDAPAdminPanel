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

const NewEntryForm = ({ id, parentDn, cancelNewEntry }: { id: string, parentDn: string, cancelNewEntry: () => void }) => {
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

      await addNewEntry(id, newEntry);
      const res = await fetchLdapEntry(id, newEntry.baseDn);

      dispatch(addEntry({
        clientId: id,
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
        Dc:
        <input value={newDc} onChange={(event) => setNewDc(event.target.value)} />
        <br></br>
        ObjectClass(s):
        <NewLdapAttributeValues newValues={newObjectClasses} setNewValues={setNewObjectClasses} />
        <br></br>
        attributes:
        <br></br>
        <NewAttributeList newAttributes={newAttributes} setNewAttributes={setNewAttributes} />
        <br></br>
        controls:
        <br></br>
        <NewLdapControls newControls={newControls} setNewControls={setNewControls} />
        <button onClick={() => cancelNewEntry()} className='negativeButton'>cancel</button>
        <button type='button' onClick={() => handleRestet()} className='negativeButton'>reset</button>
        <button type='submit' className='positiveButton'>add</button>
      </form>

    </div >
  );
};

export default NewEntryForm;
