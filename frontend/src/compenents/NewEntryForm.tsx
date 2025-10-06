import { useState, type SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';

import type { addReq } from '../utils/types';
import { addNewEntry, searchClient } from '../services/ldapdbsService';
import { addEntry } from '../slices/client';
import { addError } from '../slices/error';
import getAttributeValues from '../utils/getAttributeValues';
import NewAttributeList from './NewAttributeList';

const NewEntryForm = ({ id, parentDn }: { id: string, parentDn: string }) => {
  const [visible, setVisible] = useState<boolean>(false);

  const [newDc, setNewDc] = useState<string>('');
  const [newObjectClasses, setNewObjectClasses] = useState<string>('');
  const [newAttributes, setNewAttributes] = useState<{ id: string, attributeName: string, value: string }[]>([]);

  const dispatch = useDispatch();

  const handleAddEntry = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const newAttributeValues: Record<string, string[]> = {};
      newAttributes
        .filter((_ele, index) => index !== newAttributes.length - 1)
        .forEach((ele) => newAttributeValues[ele.attributeName] = getAttributeValues(ele.value));

      const newDn = `${newDc},${parentDn}`;

      const newEntry: addReq = {
        baseDn: newDn,
        entry: {
          ...newAttributeValues,
          objectClass: getAttributeValues(newObjectClasses)
        }
      };

      await addNewEntry(id, newEntry);
      const res = await searchClient(id, {
        baseDn: newDn,
        options: {
          scope: 'base',
          filter: '(objectClass=*)',
          derefAliases: 'always',
          sizeLimit: 0,
          timeLimit: 0,
          paged: false,
          attributes: ['*', '+']
        }
      });

      dispatch(addEntry({
        clientId: id,
        parentDn: parentDn,
        entry: res.searchEntries[0]
      }));

      //intentionally does not delete user input on error
      setNewDc('');
      setNewObjectClasses('');
      setNewAttributes([]);
    } catch (err) {
      console.log(err);
      dispatch(addError(err));
    }
  };

  const handleRestet = () => {
    setNewDc('');
    setNewObjectClasses('');
    setNewAttributes([]);
  };

  if (!visible) {
    return (<button onClick={() => setVisible(true)}>add entry</button>);
  }

  return (
    <div>
      <form onSubmit={handleAddEntry}>
        Dc:
        <input value={newDc} onChange={(event) => setNewDc(event.target.value)} />
        <br></br>
        ObjectClass(s):
        <input value={newObjectClasses} onChange={(event) => setNewObjectClasses(event.target.value)} />
        <br></br>
        attributes:
        <br></br>
        <NewAttributeList newAttributes={newAttributes} setNewAttributes={setNewAttributes} />
        <button type='button' onClick={() => handleRestet()}>reset</button>
        <button type='submit'>add</button>
      </form>
      <button onClick={() => setVisible(false)}>hide</button>
    </div >
  );
};

export default NewEntryForm;
