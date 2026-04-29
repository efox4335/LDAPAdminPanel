import { useEffect } from 'react';
import { useAppDispatch as useDispatch } from './utils/reduxHooks';

import { getAllServers } from './services/ldapdbsService';
import { addServers } from './slices/server';
import { setDefaults, setSettings } from './slices/settings';
import ServersDisplay from './compenents/ServersDisplay';
import ErrorsDisplay from './compenents/ErrorsDisplay';
import { getSettings } from './services/settingsService';
import SettingsDisplay from './compenents/SettingsDisplay';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchServers = async () => {
      const servers = await getAllServers();

      dispatch(addServers(servers));
    };

    const fetchSettings = async () => {
      const settings = await getSettings();

      dispatch(setSettings(settings.settings));
      dispatch(setDefaults(settings.defaults));
    };

    void fetchServers();
    void fetchSettings();
  });

  return (
    <div className='mainDisplay'>
      <ErrorsDisplay />
      <ServersDisplay />
      <SettingsDisplay />
    </div>
  );
};

export default App;
