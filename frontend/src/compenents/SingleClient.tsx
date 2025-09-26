import type { client } from '../utils/types';

const SingleClient = ({ client }: { client: client }) => {
  const boundDn = (client.boundDn === null) ? 'null' : client.boundDn;

  const connectionString = (client.isConnected) ? 'connected' : 'not connected';

  return (
    <div>
      Server Url: {client.serverUrl}
      <br></br>
      Bound DN: {boundDn}
      <br></br>
      {connectionString}
    </div>
  );
};

export default SingleClient;
