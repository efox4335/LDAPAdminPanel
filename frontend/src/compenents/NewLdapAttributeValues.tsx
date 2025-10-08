import { v4 as uuidv4 } from 'uuid';
import { useEffect, type Dispatch, type SetStateAction } from 'react';

import type { newLdapAttributeValue } from '../utils/types';

const NewLdapAttributeValues = ({ newValues, setNewValues }:
  {
    newValues: newLdapAttributeValue[],
    setNewValues: Dispatch<SetStateAction<newLdapAttributeValue[]>>
  }
) => {
  useEffect(() => {
    if (newValues.length === 0 || newValues[newValues.length - 1].value !== '') {
      setNewValues([
        ...newValues,
        {
          id: uuidv4(),
          value: ''
        }
      ]);

      return;
    }
  }, [newValues]);

  return (
    <>
      {newValues.map((value) => {
        return (
          <div key={value.id}>
            <input value={value.value} onChange={(event) => setNewValues(newValues.map((val) => {
              if (val.id === value.id) {
                return {
                  ...val,
                  value: event.target.value
                };
              }

              return val;
            }))} />
            <button type='button' onClick={() => setNewValues(newValues.filter((val) => val.id !== value.id))}>
              delete
            </button>
          </div>
        );
      })}
    </>
  );
};

export default NewLdapAttributeValues;
