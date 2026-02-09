import { useEffect, useState, type SyntheticEvent } from 'react';

import { useAppSelector as useSelector, useAppDispatch as useDispatch } from '../utils/reduxHooks';
import { selectSetting, selectSettingDefault, openSettingsPanel, closeSettingsPanel, selectSettingsPanelIsOpen, setSettings } from '../slices/settings';
import SingleSettingContainer from './SingleSettingContainer';
import { truncateSettings } from '../services/settingsService';
import { addError } from '../slices/error';

const SettingsDisplay = () => {
  const enableLogging = useSelector((state) => selectSetting(state, { path: ['logging', 'enableLogging'] }));
  const defaultEnableLogging = useSelector((state) => selectSettingDefault(state, { path: ['logging', 'enableLogging'] }));
  const [currentEnableLogging, setCurrentEnableLogging] = useState<boolean>(true);

  useEffect(() => {
    if (typeof (enableLogging) === 'boolean') {
      setCurrentEnableLogging(enableLogging);
    }
  }, [enableLogging]);

  const logFile = useSelector((state) => selectSetting(state, { path: ['logging', 'logFile'] }));
  const defaultLogFile = useSelector((state) => selectSettingDefault(state, { path: ['logging', 'logFile'] }));
  const [currentLogFile, setCurrentLogFile] = useState<string>('');

  useEffect(() => {
    if (typeof (logFile) === 'string') {
      setCurrentLogFile(logFile);
    }
  }, [logFile]);

  const dispatch = useDispatch();

  const isSettingsOpen = useSelector(selectSettingsPanelIsOpen);

  const toggleSettingsIsOpen = () => {
    if (isSettingsOpen) {
      dispatch(closeSettingsPanel());
    } else {
      dispatch(openSettingsPanel());
    }
  };

  const handleResetToDefault = () => {
    if (defaultEnableLogging === undefined || typeof (defaultEnableLogging) !== 'boolean') {
      dispatch(addError(new Error('enable logging missing default')));
    } else {
      setCurrentEnableLogging(defaultEnableLogging);
    }

    if (defaultLogFile === undefined || typeof (defaultLogFile) !== 'string') {
      dispatch(addError(new Error('log file missing default')));
    } else {
      setCurrentLogFile(defaultLogFile);
    }
  };

  const handelCancelChanges = () => {
    if (typeof (enableLogging) === 'boolean') {
      setCurrentEnableLogging(enableLogging);
    }

    if (typeof (logFile) === 'string') {
      setCurrentLogFile(logFile);
    }
  };

  const handelSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const newSettings = await truncateSettings({
        settings: [
          {
            path: ['logging', 'enableLogging'],
            value: currentEnableLogging
          },
          {
            path: ['logging', 'logFile'],
            value: currentLogFile
          }
        ]
      });

      dispatch(setSettings(newSettings.settings));
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <div className={isSettingsOpen ? 'openSettingsDisplay' : 'closedSettingsDisplay'}>
      <div className={isSettingsOpen ? 'openSettingsPanelToggleButtonContainer' : 'closedSettingsPanelToggleButtonContainer'} >
        <h3>
          <button onClick={() => toggleSettingsIsOpen()} className='settingsPanelToggleButton'>
            {isSettingsOpen ? '\u{23f7}' : '\u{23f5}'}
            Settings
          </button>
        </h3>
      </div>
      {
        isSettingsOpen ?
          <div className='settingsContainer'>
            <form onSubmit={handelSubmit}>
              <div className='settingsTableMarginContainer'>
                <table className='settingsTable'>
                  <thead>
                    <tr>
                      <th scope='row'>setting</th>
                      <th scope='row'>value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <SingleSettingContainer<boolean>
                      name='enable logging'
                      curValue={currentEnableLogging}
                      setCurValue={setCurrentEnableLogging}
                      curSetValue={enableLogging as boolean | undefined}
                    >
                      <select
                        value={currentEnableLogging.toString()}
                        onChange={(event) => {
                          if (event.target.value === 'true') {
                            setCurrentEnableLogging(true);
                          } else {
                            setCurrentEnableLogging(false);
                          }
                        }}
                      >
                        <option value='true'>true</option>
                        <option value='false'>false</option>
                      </select>
                    </SingleSettingContainer>
                    <SingleSettingContainer<string>
                      name='log file'
                      curValue={currentLogFile}
                      setCurValue={setCurrentLogFile}
                      curSetValue={logFile as string | undefined}
                    >
                      <input type='textbox' value={currentLogFile} onChange={(event) => setCurrentLogFile(event.target.value)} />
                    </SingleSettingContainer>
                  </tbody>
                </table>
                <br></br>
                <button type='button' className='negativeButton' onClick={handleResetToDefault}>reset to default</button>
                <button type='button' className='negativeButton' onClick={handelCancelChanges}>cancel</button>
                <button type='submit' className='positiveButton'>apply</button>
              </div>
            </form>
          </div> : <></>
      }
    </div>
  );
};

export default SettingsDisplay;
