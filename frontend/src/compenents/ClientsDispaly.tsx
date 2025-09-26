import { useSelector } from 'react-redux';

import { selectClients } from '../slices/client';
import SingleClient from './SingleClient';

const ClientsDispaly = () => {
  const clients = useSelector(selectClients);

  return (
    <div>
      <h2>Clients:</h2>
      {clients.map((client) => {
        return (
          <div key={client.id}>
            <SingleClient client={client} />
          </div>
        );
      })}
    </div>
  );
};

export default ClientsDispaly;
