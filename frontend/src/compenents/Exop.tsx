import { useState, type SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';

import { addError } from '../slices/error';
import { exopClient } from '../services/ldapdbsService';
import type { newControlObject } from '../utils/types';
import NewLdapControls from './NewLdapControls';
import getControls from '../utils/getControls';

const Exop = ({ clientId }: { clientId: string }) => {
  const [newExopOid, setNewExopOid] = useState<string>('');
  const [doesNewExopHaveValue, setDoesNewExopHaveValue] = useState<boolean>(false);
  const [newExopValue, setNewExopValue] = useState<string>('');

  const [oldExopOid, setOldExopOid] = useState<string>('');
  const [oldExopValue, setOldExopValue] = useState<string>('');

  const [newControls, setNewControls] = useState<newControlObject[]>([]);

  const dispatch = useDispatch();

  const resetForm = () => {
    setNewExopOid('');
    setDoesNewExopHaveValue(false);
    setNewExopValue('');

    setNewControls([]);
  };

  const handleExop = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const res = await exopClient(clientId, {
        oid: newExopOid,
        value: doesNewExopHaveValue ? newExopValue : undefined,
        control: getControls(newControls)
      });

      resetForm();

      setOldExopOid(res.oid ? res.oid : '');
      setOldExopValue(res.value ? res.value : '');
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <div className='singleClientExop'>
      <h4>Extended operation:</h4>
      <form onSubmit={handleExop}>
        <div className='userInteractionContainer'>
          oid:
          <input value={newExopOid} onChange={(event) => setNewExopOid(event.target.value)} />
          {doesNewExopHaveValue ?
            <div>
              value:
              <input value={newExopValue} onChange={(event) => setNewExopValue(event.target.value)} />
            </div> : <></>}
          <br></br>
          <button type='button' onClick={() => setDoesNewExopHaveValue(!doesNewExopHaveValue)}>
            {doesNewExopHaveValue ? <>cancel</> : <>add value</>}
          </button>
          <NewLdapControls newControls={newControls} setNewControls={setNewControls} />
        </div>
        <button type='button' className='negativeButton' onClick={() => resetForm()}>reset</button>
        <button type='submit' className='positiveButton'>start</button>
      </form>
      {(oldExopOid !== '' || oldExopValue !== '') ?
        <div>
          <br></br>
          result:
          <br></br>
          oid: {oldExopOid}
          <br></br>
          value: {oldExopValue}
        </div> : <></>}

    </div>
  );
};

export default Exop;
