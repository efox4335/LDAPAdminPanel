import { useState, type SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';

import { addError } from '../slices/error';
import { exopClient } from '../services/ldapdbsService';
import type { newControlObject } from '../utils/types';
import NewLdapControls from './NewLdapControls';
import getControls from '../utils/getControls';

const Exop = ({ clientId }: { clientId: string }) => {
  const [newExopOid, setNewExopOid] = useState<string>('');
  const [newExopValue, setNewExopValue] = useState<string>('');

  const [oldExopOid, setOldExopOid] = useState<string>('');
  const [oldExopValue, setOldExopValue] = useState<string>('');

  const [newControls, setNewControls] = useState<newControlObject[]>([]);

  const dispatch = useDispatch();

  const resetForm = () => {
    setNewExopOid('');
    setNewExopValue('');

    setNewControls([]);
  };

  const handleExop = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const res = await exopClient(clientId, {
        oid: newExopOid,
        value: newExopValue !== '' ? newExopValue : undefined,
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
      <h4>extended operation</h4>
      <form onSubmit={handleExop} className='singleClientExopForm'>
        <div className='userInteractionContainer'>
          <table>
            <tbody>
              <tr className='headlessFirstTableRow'>
                <td>
                  oid
                </td>
                <td>
                  <input value={newExopOid} onChange={(event) => setNewExopOid(event.target.value)} />
                </td>
              </tr>
              <tr>
                <td>
                  value
                </td>
                <td>
                  <input value={newExopValue} onChange={(event) => setNewExopValue(event.target.value)} />
                </td>
              </tr>
            </tbody>
          </table>
          <br></br>
          <NewLdapControls tableName='controls' newControls={newControls} setNewControls={setNewControls} />
        </div>
        <div className='userInteractionButtons'>
          <button type='button' className='negativeButton' onClick={() => resetForm()}>reset</button>
          <button type='submit' className='positiveButton'>start</button>
        </div>
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
