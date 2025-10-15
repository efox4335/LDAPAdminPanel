import { useSelector } from 'react-redux';

import { selectClients } from '../slices/client';
import SingleClient from './SingleClient';
import NewClientForm from './NewClientForm';

const ClientsDisplay = () => {
  const clients = useSelector(selectClients);

  return (
    <div className='clientsDisplay'>
      <NewClientForm />
      <h2 className='clientsHeader'>Clients:</h2>
      <div className='clientsList'>
        {Object.keys(clients).map((clientIndex) => {
          const client = clients[clientIndex];

          return (
            <div key={client.id}>
              <SingleClient client={client} />
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ClientsDisplay;
