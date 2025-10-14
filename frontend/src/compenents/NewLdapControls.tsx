import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { newControlObject } from '../utils/types';

const NewLdapControls = ({ newControls, setNewControls }: {
  newControls: newControlObject[],
  setNewControls: Dispatch<SetStateAction<newControlObject[]>>
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
    <div>
      {newControls.map((control) => {
        return (
          <div key={control.id}>
            control:
            <input value={control.type} onChange={(event) => setNewControls(newControls.map((c) => {
              if (c.id === control.id) {
                return {
                  ...c,
                  type: event.target.value
                };
              }

              return c;
            }))} />
            <button type='button' onClick={() => setNewControls(newControls.map((c) => {
              if (c.id === control.id) {
                return {
                  ...c,
                  critical: !c.critical
                };
              }

              return c;
            }))}>
              {control.critical ? <>mark not critical</> : <>mark critical</>}
            </button>
            <button type='button' onClick={() => setNewControls(newControls.filter((c) => c.id !== control.id))}>
              delete
            </button>
          </div>
        );
      })}
      <button type='button' onClick={() => setNewControls([])}>reset</button>
    </div>
  );
};

export default NewLdapControls;
