import { v4 as uuidv4 } from 'uuid';
import { useEffect, type Dispatch, type SetStateAction, type ComponentType } from 'react';

import type { newLdapAttributeValue } from '../utils/types';
import DeleteButton from './DeleteButton';

const NewLdapAttributeValues = <T extends { onChange: (arg0: string) => void, value: string } | undefined,>
  ({ newValues, setNewValues, CustomInput = undefined, customInputProps = undefined }:
    {
      newValues: newLdapAttributeValue[],
      setNewValues: Dispatch<SetStateAction<newLdapAttributeValue[]>>,
      CustomInput?: ComponentType<T>,
      customInputProps?: Omit<T, 'onChange' | 'value'>
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
        const updateFunc = (newVal: string) => {
          setNewValues(newValues.map((val) => {
            if (val.id === value.id) {
              return {
                ...val,
                value: newVal
              };
            }

            return val;
          }));
        };

        const curProps = { ...customInputProps, onChange: updateFunc, value: value.value } as T;

        return (
          <div key={value.id} className='attributeContainer'>
            {(CustomInput !== undefined && customInputProps !== undefined) ? <CustomInput {...curProps!} /> :
              <input value={value.value} onChange={(event) => updateFunc(event.target.value)} />}
            <DeleteButton delFunction={() => setNewValues(newValues.filter((val) => val.id !== value.id))} />
          </div>
        );
      })}
    </>
  );
};

export default NewLdapAttributeValues;
