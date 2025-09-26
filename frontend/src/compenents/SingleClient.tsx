import { useDispatch } from 'react-redux';

import type { client } from '../utils/types';
import { deleteClient } from '../services/ldapdbsService';
import { delClient } from '../slices/client';

const SingleClient = ({ client }: { client: client }) => {
  const dispatch = useDispatch();

  const boundDn = (client.boundDn === null) ? 'null' : client.boundDn;

  const connectionString = (client.isConnected) ? 'connected' : 'not connected';

  const handleDelete = async () => {
    try {
      await deleteClient(client.id);

      dispatch(delClient(client.id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      Server Url: {client.serverUrl}
      <br></br>
      Bound DN: {boundDn}
      <br></br>
      {connectionString}
      <br></br>
      <button onClick={handleDelete}>remove</button>
    </div>
  );
};

export default SingleClient;
