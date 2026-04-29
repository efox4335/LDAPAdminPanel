import { useState, type SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';

import type { bindReq, server, newControlObject } from '../utils/types';
import { bindServer } from '../services/ldapdbsService';
import { addServer } from '../slices/server';
import { addError } from '../slices/error';
import NewLdapControls from './NewLdapControls';
import getControls from '../utils/getControls';
import AdvancedDropdown from './AdvancedDropdown';

const BindForm = ({ server }: { server: server }) => {
  const [newDn, setNewDn] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newControls, setNewControls] = useState<newControlObject[]>([]);

  const dispatch = useDispatch();

  const resetForm = () => {
    setNewDn('');
    setNewPassword('');
    setNewControls([]);
  };

  const handleBind = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const req: bindReq = {
        dnOrSaslMechanism: newDn,
        password: (newPassword === '') ? undefined : newPassword,
        control: getControls(newControls)
      };

      resetForm();

      await bindServer(server.id, req);

      const newServer = {
        ...server,
        isConnected: true,
        boundDn: req.dnOrSaslMechanism
      };

      dispatch(addServer(newServer));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <div className='singleServerBind'>
      <h4>bind</h4>
      <form onSubmit={handleBind} className='singleServerOperationForm'>
        <div className='userInteractionContainer'>
          <table>
            <tbody>
              <tr className='headlessFirstTableRow'>
                <td>
                  dn
                </td>
                <td>
                  <input value={newDn} onChange={(event) => setNewDn(event.target.value)} />
                </td>
              </tr>
              <tr>
                <td>
                  password
                </td>
                <td>
                  <input type='password' value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                </td>
              </tr>
            </tbody>
          </table>
          <AdvancedDropdown displayText='advanced options'>
            <NewLdapControls tableName='controls' newControls={newControls} setNewControls={setNewControls} />
          </AdvancedDropdown>
        </div>
        <div className='userInteractionButtons'>
          <button type='button' className='negativeButton' onClick={() => resetForm()}>reset</button>
          <button className='positiveButton'>bind</button>
        </div>
      </form>
    </div>
  );
};

export default BindForm;
