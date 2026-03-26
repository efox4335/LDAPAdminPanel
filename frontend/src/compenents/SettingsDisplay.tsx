import { useEffect, useState, type SyntheticEvent } from 'react';

import { useAppSelector as useSelector, useAppDispatch as useDispatch } from '../utils/reduxHooks';
import {
  selectSetting,
  selectSettingDefault,
  openSettingsPanel,
  closeSettingsPanel,
  selectSettingsPanelIsOpen,
  setSettings
} from '../slices/settings';
import SingleSettingContainer from './SingleSettingContainer';
import { truncateSettings } from '../services/settingsService';
import { addError } from '../slices/error';
import DeleteButton from './DeleteButton';
import AdvancedDropdown from './AdvancedDropdown';

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

  const forceTls = useSelector((state) => selectSetting(state, { path: ['tls', 'forceTls'] }));
  const defaultForceTls = useSelector((state) => selectSetting(state, { path: ['tls', 'forceTls'] }));
  const [currentForceTls, setCurrentForceTls] = useState<boolean>(false);

  useEffect(() => {
    if (typeof (forceTls) === 'boolean') {
      setCurrentForceTls(forceTls);
    }
  }, [forceTls]);

  const customCertificateAuthorities = useSelector((state) => selectSetting(state, { path: ['tls', 'customCertificateAuthorities'] }));
  const defaultCustomCertificateAuthorities = useSelector((state) => selectSetting(state, { path: ['tls', 'customCertificateAuthorities'] }));
  const [currentCustomCertificateAuthorities, setCurrentCustomCertificateAuthorities] = useState<string[]>([]);

  useEffect(() => {
    if (Array.isArray(customCertificateAuthorities) &&
      customCertificateAuthorities.reduce((allPrevAreString: boolean, cert) => allPrevAreString && typeof (cert) === 'string', true)) {
      setCurrentCustomCertificateAuthorities(customCertificateAuthorities as string[]);
    }
  }, [customCertificateAuthorities]);

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

    if (defaultForceTls === undefined || typeof (defaultForceTls) !== 'boolean') {
      dispatch(addError(new Error('force tls missing default')));
    } else {
      setCurrentForceTls(defaultForceTls);
    }

    if (defaultCustomCertificateAuthorities === undefined ||
      !Array.isArray(defaultCustomCertificateAuthorities) ||
      !defaultCustomCertificateAuthorities.reduce((allPrevAreString: boolean, cert) => allPrevAreString && typeof (cert) === 'string', true)) {
      dispatch(addError(new Error('custom certificate authorties missing default')));
    } else {
      setCurrentCustomCertificateAuthorities(defaultCustomCertificateAuthorities as string[]);
    }
  };

  const handelCancelChanges = () => {
    if (typeof (enableLogging) === 'boolean') {
      setCurrentEnableLogging(enableLogging);
    }

    if (typeof (logFile) === 'string') {
      setCurrentLogFile(logFile);
    }

    if (typeof (forceTls) === 'boolean') {
      setCurrentForceTls(forceTls);
    }

    if (Array.isArray(customCertificateAuthorities) &&
      customCertificateAuthorities.reduce((allPrevAreString: boolean, cert) => allPrevAreString && typeof (cert) === 'string', true)) {
      setCurrentCustomCertificateAuthorities(customCertificateAuthorities as string[]);
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
          },
          {
            path: ['tls', 'forceTls'],
            value: currentForceTls
          },
          {
            path: ['tls', 'customCertificateAuthorities'],
            value: currentCustomCertificateAuthorities
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
                    <SingleSettingContainer<boolean>
                      name='force tls'
                      curValue={currentForceTls}
                      setCurValue={setCurrentForceTls}
                      curSetValue={forceTls as boolean | undefined}
                    >
                      <select
                        value={currentForceTls.toString()}
                        onChange={(event) => {
                          if (event.target.value === 'true') {
                            setCurrentForceTls(true);
                          } else {
                            setCurrentForceTls(false);
                          }
                        }}
                      >
                        <option value='true'>true</option>
                        <option value='false'>false</option>
                      </select>
                    </SingleSettingContainer>
                    <SingleSettingContainer<string[]>
                      name='custom certificates'
                      curValue={currentCustomCertificateAuthorities}
                      setCurValue={setCurrentCustomCertificateAuthorities}
                      curSetValue={customCertificateAuthorities as string[] | undefined}
                    >
                      <>
                        {
                          currentCustomCertificateAuthorities.map((cert) => {
                            return (
                              <div key={cert}>
                                certificate starting with {
                                  cert.concat('').split('-----BEGIN CERTIFICATE-----')[1].slice(0, 10)
                                }
                                <DeleteButton delFunction={() => {
                                  setCurrentCustomCertificateAuthorities(
                                    currentCustomCertificateAuthorities.filter((curCer) => curCer !== cert)
                                  );
                                }} />

                                <AdvancedDropdown displayText='full certificate'>
                                  <div className='rawCertDisplay'>
                                    {cert}
                                  </div>
                                </AdvancedDropdown>

                              </div>
                            );
                          })
                        }
                        <br></br>
                        <div>
                          import certificate
                          <label className='fileInputDisplay'>
                            select file
                            <input type='file' accept='.pem' onChange={(event) => {
                              const reader = new FileReader();

                              reader.onload = (res) => {
                                if (res.target === null) {
                                  return;
                                }

                                const val = res.target.result;

                                if (val === null || typeof (val) !== 'string' || !/-----BEGIN CERTIFICATE-----.*/.test(val)) {
                                  return;
                                }

                                setCurrentCustomCertificateAuthorities([
                                  ...currentCustomCertificateAuthorities,
                                  val
                                ]);
                              };

                              reader.readAsText(event.target.files![0]);
                            }
                            } />
                          </label>
                        </div>
                      </>
                    </SingleSettingContainer>
                  </tbody>
                </table>
                <br></br>
                <button type='button' className='negativeButton' onClick={handleResetToDefault}>reset to default</button>
                <button type='button' className='negativeButton' onClick={handelCancelChanges}>cancel</button>
                <button type='submit' className='positiveButton'>apply</button>
              </div>
            </form>
          </div > : <></>
      }
    </div >
  );
};

export default SettingsDisplay;
