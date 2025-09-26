import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getAllClients } from './services/ldapdbsService';
import { addClients } from './slices/client';
import ClientsDisplay from './compenents/ClientsDisplay';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchClients = async () => {
      const clients = await getAllClients();

      dispatch(addClients(clients));
    };

    void fetchClients();
  });

  return (
    <div>
      <ClientsDisplay />
    </div>
  );
};

export default App;
