import { useState, type SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';

import type { bindReq, client, newControlObject } from '../utils/types';
import { bindClient } from '../services/ldapdbsService';
import { addClient } from '../slices/client';
import { addError } from '../slices/error';
import NewLdapControls from './NewLdapControls';
import getControls from '../utils/getControls';

const BindForm = ({ client }: { client: client }) => {
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

      await bindClient(client.id, req);

      const newClient = {
        ...client,
        isConnected: true,
        boundDn: req.dnOrSaslMechanism
      };

      dispatch(addClient(newClient));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <div className='singleClientBind'>
      <h4>bind: </h4>
      <form onSubmit={handleBind} className='singleClientBindForm'>
        <div className='userInteractionContainer'>
          Dn:
          <input value={newDn} onChange={(event) => setNewDn(event.target.value)} />
          <br></br>
          password:
          <input type='password' value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          <br></br>
          controls:
          <br></br>
          <NewLdapControls newControls={newControls} setNewControls={setNewControls} />
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
