import { useEffect } from 'react';
import { useAppDispatch as useDispatch } from './utils/reduxHooks';

import { getAllClients } from './services/ldapdbsService';
import { addClients } from './slices/client';
import ClientsDisplay from './compenents/ClientsDisplay';
import ErrorsDisplay from './compenents/ErrorsDisplay';

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
      <ErrorsDisplay />
      <ClientsDisplay />
    </div>
  );
};

export default App;
