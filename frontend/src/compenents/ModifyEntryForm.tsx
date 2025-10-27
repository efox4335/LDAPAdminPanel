import { useDispatch } from 'react-redux';
import { useState, type SyntheticEvent } from 'react';

import type { modifyReq, newLdapAttribute, serverTreeEntry, newControlObject } from '../utils/types';
import parseModifyedAttributes from '../utils/parseModifiedAttributes';
import { addError } from '../slices/error';
import { modifyEntry, modifyEntryDn } from '../services/ldapdbsService';
import { fetchLdapEntry, fetchLdapSubtree } from '../utils/query';
import { updateEntry, concatEntryMap, delEntry } from '../slices/client';
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

  const [isModifyDnControlsVisible, setIsModifyDnControlsVisible] = useState<boolean>(false);
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

      hideForm();
      setModifiedAttributes([]);
      setNewModifyControls([]);

      //runs after seemingly redundant fetch and dispatch because if modifyEntryDn throws but modifyEntry does not the entry will have outdated info
      if (newDn !== entry.dn) {
        await modifyEntryDn(clientId, {
          dn: entry.dn,
          newDN: newDn,
          control: getControls(newModifyDnControls)
        });

        const rawSubtree = await fetchLdapSubtree(clientId, newDn);

        const formattedSubtree = generateLdapServerTree(rawSubtree, newDn);

        dispatch(concatEntryMap({ clientId: clientId, parentDn: getParentDn(newDn), subtreeRootDn: newDn, entryMap: formattedSubtree }));
        dispatch(delEntry({ clientId: clientId, dn: entry.dn }));
      }
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      dn:
      <input value={newDn} onChange={(event) => setNewDn(event.target.value)} />
      {newDn === entry.dn ? <></> :
        <button type='button' onClick={() => setNewDn(entry.dn)}>reset</button>}
      <button type='button' onClick={() => setIsModifyDnControlsVisible(!isModifyDnControlsVisible)}>
        {isModifyDnControlsVisible ? <>hide</> : <>add modify dn controls</>}
      </button>
      {isModifyDnControlsVisible ? <NewLdapControls newControls={newModifyDnControls} setNewControls={setNewModifyDnControls} /> : <></>}
      <NewAttributeList newAttributes={modifiedAttributes} setNewAttributes={setModifiedAttributes} />
      <br></br>
      modify controls:
      <NewLdapControls newControls={newModifyControls} setNewControls={setNewModifyControls} />
      <button type='button' onClick={() => hideForm()} className='negativeButton'>cancel</button>
      <button type='button' onClick={() => resetForm()} className='negativeButton'>reset</button>
      <button className='positiveButton'>save</button>
    </form >
  );
};

export default ModifyEntryForm;
