import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { newLdapAttribute } from '../utils/types';
import NewLdapAttributeValues from './NewLdapAttributeValues';

const NewValues = ({ attributeId, attributeIndex, newAttributes, setNewAttributes }:
  {
    attributeId: string,
    attributeIndex: number,
    newAttributes: newLdapAttribute[],
    setNewAttributes: Dispatch<SetStateAction<newLdapAttribute[]>>
  }) => {
  const [newValues, setNewValues] = useState<{ id: string, value: string }[]>(newAttributes[attributeIndex].values);

  useEffect(() => {
    setNewAttributes(newAttributes.map((attribute) => {
      if (attribute.id === attributeId) {
        return {
          ...attribute,
          values: newValues
        };
      }

      return attribute;
    }));
  }, [newValues]);

  return (
    <NewLdapAttributeValues newValues={newValues} setNewValues={setNewValues} />
  );
};

const NewAttributeList = ({ newAttributes, setNewAttributes }:
  {
    newAttributes: newLdapAttribute[],
    setNewAttributes: Dispatch<SetStateAction<newLdapAttribute[]>>
  }) => {
  useEffect(() => {
    if (newAttributes.length === 0 || newAttributes[newAttributes.length - 1].attributeName !== '') {
      setNewAttributes([
        ...newAttributes,
        {
          id: uuidv4(),
          attributeName: '',
          values: []
        }
      ]);
    }
  }, [newAttributes]);

  return (
    <div>
      {newAttributes.map((attribute, index) => {
        return (
          <div key={attribute.id}>
            attribute:
            <input value={attribute.attributeName} onChange={(event) => setNewAttributes(newAttributes.map((attr) => {
              if (attr.id === attribute.id) {
                return {
                  ...attr,
                  attributeName: event.target.value
                };
              }

              return attr;
            }))} />
            <button type='button' onClick={() => setNewAttributes(newAttributes.filter((ele) => ele.id !== attribute.id))}>
              delete
            </button>
            <br></br>
            values:
            <NewValues attributeId={attribute.id} attributeIndex={index} newAttributes={newAttributes} setNewAttributes={setNewAttributes} />
          </div>
        );
      })}
    </div>
  );
};

export default NewAttributeList;
