import { useSelector } from 'react-redux';

import { selectClients } from '../slices/client';
import { selectSettingsPanelIsOpen } from '../slices/settings';
import SingleClient from './SingleClient';
import NewClientForm from './NewClientForm';

const ClientsDisplay = () => {
  const clients = useSelector(selectClients);

  const settingsState = useSelector(selectSettingsPanelIsOpen);

  return (
    <div className={settingsState ? 'clientsDisplayWithOpenSettings' : 'clientsDisplayWithClosedSettings'}>
      <NewClientForm />
      <h2 className='clientsHeader'>Clients:</h2>
      <div className='clientsList'>
        {Object.keys(clients).map((clientIndex) => {
          const client = clients[clientIndex];

          return (
            <SingleClient client={client} key={client.id} />
          );
        })}
      </div>

    </div>
  );
};

export default ClientsDisplay;
