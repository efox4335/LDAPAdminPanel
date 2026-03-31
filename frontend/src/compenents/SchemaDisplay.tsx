import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { useState } from 'react';

import AdvancedDropdown from './AdvancedDropdown';
import TextboxWithDropDownAutoCompelete from './TextboxWithDropDownAutoCompelete';
import { selectOriginalObjectClassesByClientId } from '../slices/client';
import type { objectClassSchema } from '../utils/types';
import getObjectClassFromNameMap from '../utils/getObjectClassFromNameMap';

const SchemaHeaderWrapper = ({ displayText }: { displayText: string }) => {
  return (
    <h4>
      {displayText}
    </h4>
  );
};

const SchemaDisplay = ({ clientId }: { clientId: string }) => {
  const objectClassSchemas = useSelector((state) => selectOriginalObjectClassesByClientId(state, clientId));

  const [openObjectClassSchemas, setOpenObjectClassSchemas] = useState<objectClassSchema[]>([]);

  const [curSelectedSchema, setCurSelectedSchema] = useState<string>('');

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

  return (
    <AdvancedDropdown displayText='schemas' TextWrapper={SchemaHeaderWrapper}>
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

                      <table>
                        <tbody>
                          <tr className='headlessFirstTableRow'>
                            <td>
                              oid
                            </td>
                            <td>
                              {val.oid}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              names
                            </td>
                            <td>
                              {val.names ? <div>
                                {val.names.map((name) => {
                                  return (<div key={name}>{name}</div>);
                                })}
                              </div> : <>here</>}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              description
                            </td>
                            <td>
                              {val.description ?? ''}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              obsolete
                            </td>
                            <td>
                              {val.obsolete.toString()}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              superior object classes
                            </td>
                            <td>
                              {val.superiorObjectClasses ? <div>
                                {val.superiorObjectClasses.map((supObjClass) => {
                                  return (
                                    <div key={supObjClass}>
                                      {supObjClass}
                                    </div>
                                  );
                                })}
                              </div> : <></>}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              type
                            </td>
                            <td>
                              {val.type}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              required attributes
                            </td>
                            <td>
                              {val.reqAttributes ? <div>
                                {val.reqAttributes.map((attr) => {
                                  return (
                                    <div key={attr}>{attr}</div>
                                  );
                                })}
                              </div> : <></>}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              optional attributes
                            </td>
                            <td>
                              {val.optAttributes ? <div>
                                {val.optAttributes.map((attr) => {
                                  return (
                                    <div key={attr}>{attr}</div>
                                  );
                                })}
                              </div> : <></>}
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
