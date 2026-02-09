import { useEffect } from 'react';
import { useAppDispatch as useDispatch } from './utils/reduxHooks';

import { getAllClients } from './services/ldapdbsService';
import { addClients } from './slices/client';
import { setDefaults, setSettings } from './slices/settings';
import ClientsDisplay from './compenents/ClientsDisplay';
import ErrorsDisplay from './compenents/ErrorsDisplay';
import { getSettings } from './services/settingsService';
import SettingsDisplay from './compenents/SettingsDisplay';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchClients = async () => {
      const clients = await getAllClients();

      dispatch(addClients(clients));
    };

    const fetchSettings = async () => {
      const settings = await getSettings();

      dispatch(setSettings(settings.settings));
      dispatch(setDefaults(settings.defaults));
    };

    void fetchClients();
    void fetchSettings();
  });

  return (
    <div className='mainDisplay'>
      <ErrorsDisplay />
      <ClientsDisplay />
      <SettingsDisplay />
    </div>
  );
};

export default App;
