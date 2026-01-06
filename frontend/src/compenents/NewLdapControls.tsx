import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { newControlObject } from '../utils/types';
import DeleteButton from './DeleteButton';

const NewLdapControls = ({ newControls, setNewControls, tableName }: {
  newControls: newControlObject[],
  setNewControls: Dispatch<SetStateAction<newControlObject[]>>,
  tableName: string
}) => {
  useEffect(() => {
    if (newControls.length === 0 || newControls[newControls.length - 1].type !== '' || newControls[newControls.length - 1].critical !== false) {
      setNewControls([
        ...newControls,
        {
          type: '',
          critical: false,
          id: uuidv4()
        }
      ]);
    }
  }, [newControls]);

  return (
    <table>
      <thead>
        <tr>
          <th scope='row'>{tableName}</th>
          <th scope='row'>critical</th>
        </tr>
      </thead>
      <tbody>
        {newControls.map((control) => {
          return (
            <tr key={control.id}>
              <td>
                <input value={control.type} onChange={(event) => setNewControls(newControls.map((c) => {
                  if (c.id === control.id) {
                    return {
                      ...c,
                      type: event.target.value
                    };
                  }

                  return c;
                }))} />

                <DeleteButton delFunction={() => setNewControls(newControls.filter((c) => c.id !== control.id))} />
              </td>
              <td>
                <input className='criticalCheckbox' type='checkbox' checked={control.critical} onClick={() => setNewControls(newControls.map((c) => {
                  if (c.id === control.id) {
                    return {
                      ...c,
                      critical: !c.critical
                    };
                  }

                  return c;
                }))} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default NewLdapControls;
