import { useAppSelector as useSelector, useAppDispatch as useDispatch } from '../utils/reduxHooks';
import { useState, type JSX } from 'react';
import { v4 as uuid } from 'uuid';

import AdvancedDropdown from './AdvancedDropdown';
import TextboxWithDropDownAutoCompelete from './TextboxWithDropDownAutoCompelete';
import { addSchemas, selectAttributeTypesByServerId, selectLdapEntry, selectOriginalObjectClassesByServerId } from '../slices/server';
import type { ldapVendor, objectClassSchema } from '../utils/types';
import getObjectClassFromNameMap from '../utils/getObjectClassFromNameMap';
import SingleObjectClassSchemaDisplay from './SingleObjectClassSchemaDisplay';
import NewObjectClassSchemaForm from './NewObjectClassSchemaForm';
import { addError } from '../slices/error';
import { addNewEntry } from '../services/ldapdbsService';
import objectClassSchemaToString from '../utils/objectClassSchemaToString';
import fetchSchemas from '../utils/fetchSchemas';

type SchemaHeaderWrapperProps = {
  DropDownButton: JSX.Element,
  displayText: string,
  vendor: ldapVendor,
  dropDownState: boolean,
  handleNewSchema: () => void
};

const SchemaHeaderWrapper = ({ DropDownButton, displayText, vendor, handleNewSchema, dropDownState }: SchemaHeaderWrapperProps) => {
  return (
    <span className='schemaDisplayHeader'>
      <label className='hiddenLabel'>
        <h4>
          {displayText}
        </h4>
        {DropDownButton}
      </label>
      <h4></h4>
      {(vendor === 'openLdap' && dropDownState) ?
        <h4>
          <button className='positiveButton' type='button' onClick={handleNewSchema}>
            new schema
          </button>
        </h4> : <></>}
    </span>
  );
};

const SchemaDisplay = ({ serverId }: { serverId: string }) => {
  const dispatch = useDispatch();

  const objectClassSchemas = useSelector((state) => selectOriginalObjectClassesByServerId(state, serverId));

  const attributeTypes = useSelector((state) => selectAttributeTypesByServerId(state, serverId));

  const [openObjectClassSchemas, setOpenObjectClassSchemas] = useState<objectClassSchema[]>([]);

  const [newObjectClasses, setNewObjectClasses] = useState<string[]>([]);

  const [curSelectedSchema, setCurSelectedSchema] = useState<string>('');

  const dse = useSelector((state) => selectLdapEntry(state, serverId, 'dse'));

  let vendor: ldapVendor = 'unknown';

  if (dse !== undefined && dse.visible) {
    if (Array.isArray(dse.entry.objectClass)) {
      if (dse.entry.objectClass.includes('OpenLDAProotDSE')) {
        vendor = 'openLdap';
      }
    } else if (dse.entry.objectClass === 'OpenLDAProotDSE') {
      vendor = 'openLdap';
    }
  }

  const onAutoCompelete = (val: string) => {
    if (objectClassSchemas === undefined) {
      return;
    }

    const curSchema = getObjectClassFromNameMap(objectClassSchemas, val);

    setCurSelectedSchema('');

    if (curSchema === undefined) {
      return;
    }

    if (openObjectClassSchemas.reduce((schemaIncluded, curVal) => {
      return schemaIncluded || curVal.oid === curSchema.oid;
    }, false)) {
      return;
    }

    setOpenObjectClassSchemas([...openObjectClassSchemas, curSchema]);
  };

  let objectClassNames: string[] = [];

  if (objectClassSchemas !== undefined) {
    const oids: string[] = [];

    objectClassSchemas.objectClassSchemas.forEach((objectClass) => {
      if (objectClass.names !== undefined) {
        objectClassNames = objectClassNames.concat(objectClass.names);

        oids.push(objectClass.oid);
      }
    });

    objectClassNames = objectClassNames.concat(oids);
  }

  const handleNewSchema = () => {
    setNewObjectClasses([...newObjectClasses, uuid()]);
  };

  let attributeTypeNames: string[] = [];

  if (attributeTypes !== undefined) {
    const oids: string[] = [];

    attributeTypes.attributeTypes.forEach((attributeType) => {
      if (attributeType.noUserMod) {
        return;
      }

      if (attributeType.name !== undefined) {
        attributeTypeNames = attributeTypeNames.concat(attributeType.name);

        oids.push(attributeType.oid);
      }
    });

    objectClassNames = objectClassNames.concat(oids);
  }

  const createNewSchema = async (newObjectClass: objectClassSchema, id: string) => {
    try {
      const objectClassString = objectClassSchemaToString(newObjectClass);
      switch (vendor) {
        case 'openLdap':
          await addNewEntry(serverId, {
            baseDn: `cn=${newObjectClass.oid},cn=schema,cn=config`,
            entry: {
              objectClass: 'olcSchemaConfig',
              cn: newObjectClass.oid,
              olcObjectClasses: objectClassString
            }
          });

          break;
      }

      if (dse === undefined || !dse.visible) {
        return;
      }

      const schemaDn = dse.operationalEntry['subschemaSubentry'];

      if (schemaDn === undefined || Array.isArray(schemaDn)) {
        dispatch(addError(new Error('dse has no subschemaSubentry')));

        return;
      }

      const schemas = await fetchSchemas(schemaDn, serverId);

      dispatch(addSchemas({
        serverId: serverId,
        attributeTypeMap: schemas.attributeTypeMap,
        initialObjectClassMap: schemas.originalObjectClassMap,
        inheritedObjectClassMap: schemas.inheritedObjectClassMap
      }));

      setNewObjectClasses(newObjectClasses.filter((val) => val !== id));

      setOpenObjectClassSchemas([newObjectClass, ...openObjectClassSchemas]);
    } catch (err) {
      dispatch(addError(err));
    }
  };

  return (
    <AdvancedDropdown<SchemaHeaderWrapperProps>
      displayText='schemas'
      TextWrapper={SchemaHeaderWrapper}
      wrapperProps={{ vendor: vendor, handleNewSchema: handleNewSchema }}
    >
      <div className='userInteractionContainer'>
        {objectClassSchemas !== undefined ?
          <div className='schemaDisplayContainer'>
            <div>
              search
              <TextboxWithDropDownAutoCompelete
                onAutoCompelete={onAutoCompelete}
                dropdownStrings={objectClassNames}
                value={curSelectedSchema}
                onChange={setCurSelectedSchema}
              />
            </div>
            <div>
              {
                openObjectClassSchemas.map((val) => {
                  return (
                    <div key={val.oid}>
                      <button type='button' onClick={() => {
                        setOpenObjectClassSchemas(openObjectClassSchemas.filter((schema) => schema.oid !== val.oid));
                      }} className='deleteButton'>X</button>

                      <SingleObjectClassSchemaDisplay schema={val} />
                    </div>
                  );
                })
              }
            </div>
            <div>
              {
                newObjectClasses.map((id) => {
                  return (
                    <div key={id}>
                      <button type='button' className='deleteButton' onClick={() => {
                        setNewObjectClasses(newObjectClasses.filter((val) => val !== id));
                      }}>X</button>
                      <NewObjectClassSchemaForm
                        handleSubmit={createNewSchema}
                        objectClassNames={objectClassNames}
                        attributeTypeNames={attributeTypeNames}
                        id={id}
                      />
                    </div>
                  );
                })
              }
            </div>
          </div> : <div className='schemaDisplayContainer'>bind to server to fetch schemas</div>
        }
      </div>
    </AdvancedDropdown>
  );
};

export default SchemaDisplay;
