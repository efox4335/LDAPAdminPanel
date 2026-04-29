import { useSelector } from 'react-redux';

import { selectServers } from '../slices/server';
import { selectSettingsPanelIsOpen } from '../slices/settings';
import SingleServer from './SingleServer';
import NewServerForm from './NewServerForm';

const ServersDisplay = () => {
  const servers = useSelector(selectServers);

  const settingsState = useSelector(selectSettingsPanelIsOpen);

  return (
    <div className={settingsState ? 'serversDisplayWithOpenSettings' : 'serversDisplayWithClosedSettings'}>
      <NewServerForm />
      <h2 className='serversHeader'>Servers:</h2>
      <div className='serversList'>
        {Object.keys(servers).map((serverIndex) => {
          const server = servers[serverIndex];

          return (
            <SingleServer server={server} key={server.id} />
          );
        })}
      </div>

    </div>
  );
};

export default ServersDisplay;
