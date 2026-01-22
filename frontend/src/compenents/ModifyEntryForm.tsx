import { useDispatch } from 'react-redux';
import { useState, type SyntheticEvent } from 'react';

import type { modifyReq, newLdapAttribute, serverTreeEntry, newControlObject } from '../utils/types';
import parseModifyedAttributes from '../utils/parseModifiedAttributes';
import { addError } from '../slices/error';
import { modifyEntry, modifyEntryDn } from '../services/ldapdbsService';
import { fetchLdapEntry, fetchLdapChildren } from '../utils/query';
import { updateEntry, concatEntryMap, delEntry, closeOpenEntry, addOpenEntry } from '../slices/client';
import generateLdapServerTree from '../utils/generateLdapServerTree';
import getParentDn from '../utils/getParentDn';
import NewAttributeList from './NewAttributeList';
import NewLdapControls from './NewLdapControls';
import getControls from '../utils/getControls';
import getNewLdapAttributes from '../utils/getNewLdapAttributes';

const ModifyEntryForm = ({ hideForm, entry, clientId }: {
  hideForm: () => void,
  entry: Extract<serverTreeEntry, { visible: true }>,
  clientId: string
}) => {
  const dispatch = useDispatch();

  const [newDn, setNewDn] = useState<string>(entry.dn);
  const [modifiedAttributes, setModifiedAttributes] = useState<newLdapAttribute[]>(getNewLdapAttributes(entry.entry));

  const [newModifyControls, setNewModifyControls] = useState<newControlObject[]>([]);

  const [newModifyDnControls, setNewModifyDnControls] = useState<newControlObject[]>([]);

  const resetForm = () => {
    setNewDn(entry.dn);

    setModifiedAttributes(getNewLdapAttributes(entry.entry));

    setNewModifyControls([]);
    setNewModifyDnControls([]);
  };

  const handleUpdate = async (event: SyntheticEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const modifyOp: modifyReq = parseModifyedAttributes(modifiedAttributes, entry.entry);

      modifyOp['control'] = getControls(newModifyControls);

      if (modifyOp.changes.length > 0) {
        await modifyEntry(clientId, modifyOp);

        const res = await fetchLdapEntry(clientId, entry.dn);

        dispatch(updateEntry({ clientId: clientId, entry: res.visibleEntry, operationalEntry: res.operationalEntry }));
      }

      //runs after seemingly redundant fetch and dispatch because if modifyEntryDn throws but modifyEntry does not the entry will have outdated info
      if (newDn !== entry.dn) {
        await modifyEntryDn(clientId, {
          dn: entry.dn,
          newDN: newDn,
          control: getControls(newModifyDnControls)
        });

        let rawNewEntries = [await fetchLdapEntry(clientId, newDn)];

        if (entry.isExpanded) {
          const rawChildren = await fetchLdapChildren(clientId, newDn);

          rawNewEntries = rawNewEntries.concat(rawChildren);
        }

        const formattedSubtree = generateLdapServerTree(rawNewEntries, newDn);

        dispatch(concatEntryMap({ clientId: clientId, parentDn: getParentDn(newDn), subtreeRootDn: newDn, entryMap: formattedSubtree }));
        dispatch(closeOpenEntry({ clientId: clientId, entry: { entryType: 'existingEntry', entryDn: entry.dn } }));
        dispatch(delEntry({ clientId: clientId, dn: entry.dn }));
        dispatch(addOpenEntry({ clientId: clientId, entry: { entryType: 'existingEntry', entryDn: newDn } }));
      }

      hideForm();
      setModifiedAttributes([]);
      setNewModifyControls([]);
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <table>
        <thead>
          <tr>
            <th scope='row'>attribute</th>
            <th scope='row'>value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              dn
            </td>
            <td>
              <input value={newDn} onChange={(event) => setNewDn(event.target.value)} />
            </td>
          </tr>
          <NewAttributeList newAttributes={modifiedAttributes} setNewAttributes={setModifiedAttributes} />
        </tbody>
      </table>
      <br></br>

      <div className='modifyControlContainer'>
        <NewLdapControls tableName='modify controls' newControls={newModifyControls} setNewControls={setNewModifyControls} />
        <NewLdapControls tableName='modify dn controls' newControls={newModifyDnControls} setNewControls={setNewModifyDnControls} />
      </div>
      <button type='button' onClick={() => hideForm()} className='negativeButton'>cancel</button>
      <button type='button' onClick={() => resetForm()} className='negativeButton'>reset</button>
      <button className='positiveButton'>save</button>
    </form >
  );
};

export default ModifyEntryForm;
