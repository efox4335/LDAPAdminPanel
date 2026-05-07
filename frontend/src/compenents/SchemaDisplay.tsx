import { useAppSelector as useSelector, useAppDispatch as useDispatch } from '../utils/reduxHooks';
import { useState, type JSX } from 'react';
import { v4 as uuid } from 'uuid';

import AdvancedDropdown from './AdvancedDropdown';
import TextboxWithDropDownAutoCompelete from './TextboxWithDropDownAutoCompelete';
import { addSchemas, selectAttributeTypesByServerId, selectLdapEntry, selectOriginalObjectClassesByServerId } from '../slices/server';
import type { attributeTypeSchema, ldapVendor, objectClassSchema, schemaType } from '../utils/types';
import getObjectClassFromNameMap from '../utils/getObjectClassFromNameMap';
import SingleObjectClassSchemaDisplay from './SingleObjectClassSchemaDisplay';
import NewObjectClassSchemaForm from './NewSchemaForm';
import { addError } from '../slices/error';
import { addNewEntry } from '../services/ldapdbsService';
import objectClassSchemaToString from '../utils/objectClassSchemaToString';
import fetchSchemas from '../utils/fetchSchemas';
import SingleAttributeTypeSchemaDisplay from './SingleAttributeTypeSchemaDisplay';
import getAttributeTypeFromNameMap from '../utils/getAttributeTypeFromNameMap';
import attributeTypeSchemaToString from '../utils/attributeTypeSchemaToString';

type SchemaHeaderWrapperProps = {
  DropDownButton: JSX.Element,
  displayText: string,
  vendor: ldapVendor,
  dropDownState: boolean,
  handleNewSchema: () => void
};

type openSchema =
  {
    schemaType: 'objectClass',
    schema: objectClassSchema
  } |
  {
    schemaType: 'attributeType',
    schema: attributeTypeSchema
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

  const attributeTypeSchemas = useSelector((state) => selectAttributeTypesByServerId(state, serverId));

  const [openSchemas, setOpenSchemas] = useState<openSchema[]>([]);

  const [newSchemas, setNewSchemas] = useState<string[]>([]);

  const [curSelectedObjectClass, setCurSelectedObjectClass] = useState<string>('');

  const [curSelectedAttributeType, setCurSelectedAttributeType] = useState<string>('');

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

  const onObjectClassAutoCompelete = (val: string) => {
    if (objectClassSchemas === undefined) {
      return;
    }

    const curSchema = getObjectClassFromNameMap(objectClassSchemas, val);

    setCurSelectedObjectClass('');

    if (curSchema === undefined) {
      return;
    }

    if (openSchemas.reduce((schemaIncluded, curVal) => {
      return schemaIncluded || curVal.schema.oid === curSchema.oid;
    }, false)) {
      return;
    }

    setOpenSchemas([...openSchemas, { schemaType: 'objectClass', schema: curSchema }]);
  };

  const onAttributeTypeAutoCompelete = (val: string) => {
    if (attributeTypeSchemas === undefined) {
      return;
    }

    const curSchema = getAttributeTypeFromNameMap(attributeTypeSchemas, val);

    setCurSelectedAttributeType('');

    if (curSchema === undefined) {
      return;
    }

    if (openSchemas.reduce((schemaIncluded, curVal) => {
      return schemaIncluded || curVal.schema.oid === curSchema.oid;
    }, false)) {
      return;
    }

    setOpenSchemas([...openSchemas, { schemaType: 'attributeType', schema: curSchema }]);
  };

  let objectClassNames: string[] = [];

  if (objectClassSchemas !== undefined) {
    const oids: string[] = [];

    objectClassSchemas.objectClassSchemas.forEach((objectClass) => {
      if (objectClass.names !== undefined) {
        objectClassNames = objectClassNames.concat(objectClass.names);
      }

      oids.push(objectClass.oid);
    });

    objectClassNames = objectClassNames.concat(oids);
  }

  const handleNewSchema = () => {
    setNewSchemas([...newSchemas, uuid()]);
  };

  let attributeTypeNames: string[] = [];

  let operationalExcludedAttributeTypeNames: string[] = [];

  if (attributeTypeSchemas !== undefined) {
    const oids: string[] = [];

    const noOperationalOids: string[] = [];

    attributeTypeSchemas.attributeTypes.forEach((attributeType) => {
      if (attributeType.name !== undefined) {
        attributeTypeNames = attributeTypeNames.concat(attributeType.name);
      }

      oids.push(attributeType.oid);

      if (!attributeType.noUserMod) {
        operationalExcludedAttributeTypeNames = operationalExcludedAttributeTypeNames.concat(attributeType.name ?? []);

        noOperationalOids.push(attributeType.oid);
      }
    });

    operationalExcludedAttributeTypeNames = operationalExcludedAttributeTypeNames.concat(noOperationalOids);
    attributeTypeNames = attributeTypeNames.concat(oids);
  }

  const createNewSchema = async (newSchema: objectClassSchema | attributeTypeSchema, type: schemaType, id: string) => {
    try {
      switch (type) {
        case 'objectClass':
          {
            const newObjectClass = newSchema as objectClassSchema;
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
              default:
                return;
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

            setNewSchemas(newSchemas.filter((val) => val !== id));

            setOpenSchemas([{ schemaType: 'objectClass', schema: newObjectClass }, ...openSchemas]);
          }

          break;
        case 'attributeType':
          {
            const newAttributeType = newSchema as attributeTypeSchema;
            const attributeTypeString = attributeTypeSchemaToString(newAttributeType);

            switch (vendor) {
              case 'openLdap':
                await addNewEntry(serverId, {
                  baseDn: `cn=${newAttributeType.oid},cn=schema,cn=config`,
                  entry: {
                    objectClass: 'olcSchemaConfig',
                    cn: newAttributeType.oid,
                    olcAttributetypes: attributeTypeString
                  }
                });

                break;
              default:
                return;
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

            setNewSchemas(newSchemas.filter((val) => val !== id));

            setOpenSchemas([{ schemaType: 'attributeType', schema: newAttributeType }, ...openSchemas]);
          }

          break;
      }
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
              <div>
                search object classes
                <TextboxWithDropDownAutoCompelete
                  onAutoCompelete={onObjectClassAutoCompelete}
                  dropdownStrings={objectClassNames}
                  value={curSelectedObjectClass}
                  onChange={setCurSelectedObjectClass}
                />
              </div>
              <div>
                search attribute types
                <TextboxWithDropDownAutoCompelete
                  onAutoCompelete={onAttributeTypeAutoCompelete}
                  dropdownStrings={attributeTypeNames}
                  value={curSelectedAttributeType}
                  onChange={setCurSelectedAttributeType}
                />
              </div>
            </div>
            <div>
              {
                openSchemas.map((val) => {
                  return (
                    <div key={val.schema.oid}>
                      <button type='button' onClick={() => {
                        setOpenSchemas(openSchemas.filter((schema) => schema.schema.oid !== val.schema.oid));
                      }} className='deleteButton'>X</button>

                      {(val.schemaType === 'objectClass') ?
                        <SingleObjectClassSchemaDisplay schema={val.schema} /> : <></>
                      }

                      {(val.schemaType === 'attributeType') ?
                        <SingleAttributeTypeSchemaDisplay schema={val.schema} /> : <></>
                      }
                    </div>
                  );
                })
              }
            </div>
            <div>
              {
                newSchemas.map((id) => {
                  return (
                    <div key={id}>
                      <button type='button' className='deleteButton' onClick={() => {
                        setNewSchemas(newSchemas.filter((val) => val !== id));
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
