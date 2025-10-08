import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { newLdapAttribute } from '../utils/types';

const NewAttributeList = ({ newAttributes, setNewAttributes }:
  {
    newAttributes: { id: string, attributeName: string, value: string }[],
    setNewAttributes: Dispatch<SetStateAction<newLdapAttribute[]>>
  }) => {

  useEffect(() => {
    if (
      newAttributes.length === 0 ||
      !(
        newAttributes[newAttributes.length - 1].attributeName === '' &&
        newAttributes[newAttributes.length - 1].value === ''
      )) {
      setNewAttributes([...newAttributes, { id: uuidv4(), attributeName: '', value: '' }]);
    }
  }, [newAttributes]);

  return (
    <div>
      {newAttributes.map((val) => {
        return (
          <div key={val.id}>
            attribute:
            <input value={val.attributeName} onChange={(event) => {
              if (event.target.value === '' && val.value === '') {
                setNewAttributes(newAttributes.filter((ele) => ele.id !== val.id));

                return;
              }

              setNewAttributes(newAttributes.map((ele) => {
                if (ele.id === val.id) {
                  return { ...val, attributeName: event.target.value };
                }

                return ele;
              }));
            }} />
            value(s):
            <input value={val.value} onChange={(event) => {
              if (event.target.value === '' && val.attributeName === '') {
                setNewAttributes(newAttributes.filter((ele) => ele.id !== val.id));

                return;
              }

              setNewAttributes(newAttributes.map((ele) => {
                if (ele.id === val.id) {
                  return { ...val, value: event.target.value };
                }

                return ele;
              }));
            }} />
            <button type='button' onClick={() => setNewAttributes(newAttributes.filter((attr) => attr.id !== val.id))}>
              delete
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NewAttributeList;
