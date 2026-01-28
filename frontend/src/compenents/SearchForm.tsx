import { useEffect, useState, type SyntheticEvent } from 'react';
import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';

import NewLdapControls from './NewLdapControls';
import Radio from './Radio';
import type { searchDerefAliases, searchScope, newControlObject, newLdapAttributeValue } from '../utils/types';
import { addError } from '../slices/error';
import { fetchCustomSearchEntries } from '../utils/query';
import { addOpenEntry, selectNamingContextsByClientId, updateOrAddEntry } from '../slices/client';
import getParentDn from '../utils/getParentDn';
import getControls from '../utils/getControls';
import AdvancedDropdown from './AdvancedDropdown';
import getAttributeValues from '../utils/getAttributeValues';
import NewLdapAttributeValues from './NewLdapAttributeValues';

const SearchForm = ({ clientId }: { clientId: string }) => {
  const dispatch = useDispatch();

  const rawNamingContexts = useSelector((state) => selectNamingContextsByClientId(state, clientId));

  const namingContexts = rawNamingContexts
    .map((dit) => {
      return {
        id: uuid(),
        value: dit
      };
    });

  const [searchName, setSearchName] = useState<string>('');
  const [additionalFilter, setAdditionalFilter] = useState<string>('');

  const [baseDns, setBaseDns] = useState<newLdapAttributeValue[]>(namingContexts);

  const [newControls, setNewControls] = useState<newControlObject[]>([]);

  const [newSearchScope, setNewSearchScope] = useState<searchScope>('sub');

  const [newSearchDerefAliases, setNewSearchDerefAliases] = useState<searchDerefAliases>('never');

  const [searchTimeLimit, setSearchTimeLimit] = useState<number | undefined>(5);
  const [searchSizeLimit, setSearchSizeLimit] = useState<number | undefined>(10);

  useEffect(() => {
    setBaseDns(namingContexts);
  }, [rawNamingContexts]);

  const handleSearch = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const curTimeLimit = searchTimeLimit ?? 5;

      const curSizeLimit = searchSizeLimit ?? 10;

      const parsedBaseDns = getAttributeValues(baseDns);

      const dnFilter = '(:dn:caseIgnoreMatch:='
        .concat(searchName)
        .concat(')');

      let searchFilter = '';

      if (searchName !== '') {
        searchFilter = searchFilter.concat(dnFilter);
      }

      if (additionalFilter !== '') {
        searchFilter = searchFilter.concat(additionalFilter);
      }

      if (searchName !== '' && additionalFilter !== '') {
        searchFilter = '(&'
          .concat(searchFilter)
          .concat(')');
      }

      for (const baseDn of parsedBaseDns) {
        const fetchRes = await fetchCustomSearchEntries(
          clientId,
          baseDn,
          newSearchScope,
          newSearchDerefAliases,
          searchFilter,
          curTimeLimit,
          curSizeLimit,
          getControls(newControls) ?? []
        );

        fetchRes.forEach((entry) => {
          dispatch(updateOrAddEntry({
            clientId,
            parentDn: getParentDn(entry.visibleEntry.dn),
            entry: entry.visibleEntry,
            operationalEntry: entry.operationalEntry
          }));

          dispatch(addOpenEntry({ clientId, entry: { entryType: 'existingEntry', entryDn: entry.visibleEntry.dn } }));
        });
      }
    } catch (err) {
      dispatch(addError(err));
    }
  };

  const resetAdvancedForm = () => {
    setBaseDns(namingContexts);
    setNewControls([]);
    setNewSearchScope('sub');
    setNewSearchDerefAliases('never');
    setSearchTimeLimit(5);
    setSearchSizeLimit(10);
  };

  const resetBaseForm = () => {
    setSearchName('');
    setAdditionalFilter('');
  };

  return (
    <div className='singleClientSearch'>
      <h4>search</h4>
      <form onSubmit={handleSearch} className='singleClientOperationForm'>
        <div className='userInteractionContainer'>
          <table>
            <tbody>
              <tr className='headlessFirstTableRow'>
                <td>
                  name
                </td>
                <td>
                  <input value={searchName} onChange={(event) => setSearchName(event.target.value)} />
                </td>
              </tr>
              <tr>
                <td>
                  ldap filter
                </td>
                <td>
                  <input value={additionalFilter} onChange={(event) => setAdditionalFilter(event.target.value)} />
                </td>
              </tr>
            </tbody>
          </table>
          <AdvancedDropdown displayText='advanced options'>
            <div>
              <table>
                <tbody>
                  <tr className='headlessFirstTableRow'>
                    <td>
                      base dns
                    </td>
                    <td>
                      <NewLdapAttributeValues newValues={baseDns} setNewValues={setBaseDns} />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      time limit (seconds)
                    </td>
                    <td>
                      <input
                        value={searchTimeLimit ?? ''}
                        onChange={(event) => {
                          const valString = event.target.value;

                          if (valString === '') {
                            setSearchTimeLimit(undefined);

                            return;
                          }

                          const newVal = Number(valString);

                          if (!Number.isInteger(newVal) || newVal < 0) {
                            return;
                          }

                          setSearchTimeLimit(newVal);
                        }
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      max entries (0 for unlimited)
                    </td>
                    <td>
                      <input
                        value={searchSizeLimit ?? ''}
                        onChange={(event) => {
                          const valString = event.target.value;

                          if (valString === '') {
                            setSearchSizeLimit(undefined);

                            return;
                          }

                          const newVal = Number(valString);

                          if (!Number.isInteger(newVal) || newVal < 0) {
                            return;
                          }

                          setSearchSizeLimit(Number(event.target.value));
                        }
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      scope
                    </td>
                    <td>
                      <Radio<searchScope>
                        name={`${clientId}newSearchScope`}
                        elements={['sub', 'base', 'one', 'children']}
                        curSelected={newSearchScope}
                        onChange={setNewSearchScope}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      alias dereferencing
                    </td>
                    <td>
                      <Radio<searchDerefAliases>
                        name={`${clientId}newDerefAliases`}
                        elements={['never', 'always', 'find', 'search']}
                        curSelected={newSearchDerefAliases}
                        onChange={setNewSearchDerefAliases}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <br></br>
              <NewLdapControls tableName='controls' newControls={newControls} setNewControls={setNewControls} />
              <br></br>
              <button type='button' className='negativeButton' onClick={() => resetAdvancedForm()}>reset</button>
            </div>
          </AdvancedDropdown>
        </div>
        <div className='userInteractionButtons'>
          <button type='button' className='negativeButton' onClick={() => resetBaseForm()}>reset</button>
          <button className='positiveButton'>search</button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
