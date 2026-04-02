import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import type { objectClassType, newLdapAttributeValue, objectClassSchema } from '../utils/types';
import TextboxWithDropDownAutoCompelete, { type TextboxWithDropDownAutoCompeletePropsType } from './TextboxWithDropDownAutoCompelete';
import getAttributeValues from '../utils/getAttributeValues';
import NewLdapAttributeValues from './NewLdapAttributeValues';

const NewObjectClassSchemaForm = ({ handleSubmit, objectClassNames, attributeTypeNames, id }:
  {
    handleSubmit: (arg0: objectClassSchema, arg1: string) => void,
    objectClassNames: string[],
    attributeTypeNames: string[],
    id: string
  }) => {
  const [newOid, setNewOid] = useState<string>('');

  const [newNames, setNewNames] = useState<newLdapAttributeValue[]>([]);

  const [newDescription, setNewDescription] = useState<string>('');

  const [newSuperiorObjectClasses, setNewSuperiorObjectClasses] = useState<newLdapAttributeValue[]>([
    {
      id: uuid(),
      value: 'top'
    }
  ]);

  const [newType, setNewType] = useState<objectClassType>('STRUCTURAL');

  const [newReqAttributes, setNewReqAttributes] = useState<newLdapAttributeValue[]>([]);

  const [newOptAttributes, setNewOptAttributes] = useState<newLdapAttributeValue[]>([]);

  const [newObsolete, setNewObsolete] = useState<boolean>(false);

  const [oidGenerated, setOidGenerated] = useState<boolean>(false);

  const [onConfirmScreen, setOnConfirmScreen] = useState<boolean>(false);

  return (
    <form onSubmit={(event) => {
      event.preventDefault();

      const gottenNewNames = getAttributeValues(newNames);

      const gottenNewSuperiorObjectClasses = getAttributeValues(newSuperiorObjectClasses);

      const gottenNewReqAttributes = getAttributeValues(newReqAttributes);

      const gottenNewOptAttributes = getAttributeValues(newOptAttributes);

      handleSubmit({
        oid: newOid,
        names: (gottenNewNames.length === 0 || gottenNewNames[0] === '') ? undefined : gottenNewNames,
        description: newDescription === '' ? undefined : newDescription,
        superiorObjectClasses: (gottenNewSuperiorObjectClasses.length === 0 || gottenNewSuperiorObjectClasses[0] === '') ? undefined : gottenNewSuperiorObjectClasses,
        type: newType,
        reqAttributes: (gottenNewReqAttributes.length === 0 || gottenNewReqAttributes[0] === '') ? undefined : gottenNewReqAttributes,
        optAttributes: (gottenNewOptAttributes.length === 0 || gottenNewOptAttributes[0] === '') ? undefined : gottenNewOptAttributes,
        obsolete: newObsolete
      }, id);
    }}>
      {!onConfirmScreen ? <>
        <table>
          <tbody>
            <tr className='headlessFirstTableRow'>
              <td>
                oid
              </td>
              <td>
                <input type='textBox' value={newOid} onChange={(event) => setNewOid(event.target.value)} />
                <button type='button' className='positiveButton' onClick={() => {
                  const rawUuid = uuid();

                  const genOid = '5.'.concat(rawUuid.split('-').reduce((curOid, uuidPart) => {
                    return curOid.concat(BigInt('0x'.concat(uuidPart)).toString());
                  }, ''));

                  setNewOid(genOid);

                  setOidGenerated(true);
                }}>generate random oid</button>
                {oidGenerated ? <div>
                  {'generating oids may be a bad idea as oids are meant to be globally unique '}
                  <a href='https://ldap.com/object-identifiers/'>find out more</a>
                  <br></br>
                  <button type='button' className='interactionNeutralButton' onClick={() => setOidGenerated(false)}>dismiss</button>
                </div> : <></>}
              </td>
            </tr>
            <tr>
              <td>
                names
              </td>
              <td>
                <NewLdapAttributeValues newValues={newNames} setNewValues={setNewNames} />
              </td>
            </tr>
            <tr>
              <td>
                description
              </td>
              <td>
                <textarea cols={40} rows={5} value={newDescription} onChange={(event) => setNewDescription(event.target.value)} />
              </td>
            </tr>
            <tr>
              <td>
                obsolete
              </td>
              <td>
                <select
                  value={newObsolete.toString()}
                  onChange={(event) => {
                    if (event.target.value === 'true') {
                      setNewObsolete(true);
                    } else {
                      setNewObsolete(false);
                    }
                  }}
                >
                  <option value='true'>true</option>
                  <option value='false'>false</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                superior object classes
              </td>
              <td>
                <NewLdapAttributeValues<TextboxWithDropDownAutoCompeletePropsType>
                  newValues={newSuperiorObjectClasses}
                  setNewValues={setNewSuperiorObjectClasses}
                  CustomInput={TextboxWithDropDownAutoCompelete}
                  customInputProps={{
                    dropdownStrings: objectClassNames,
                    onAutoCompelete: () => { return; }
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                type
              </td>
              <td>
                <select
                  value={newType.toString()}
                  onChange={(event) => {
                    switch (event.target.value) {
                      case 'ABSTRACT':
                        setNewType('ABSTRACT');
                        break;
                      case 'STRUCTURAL':
                        setNewType('STRUCTURAL');
                        break;
                      case 'AUXILIARY':
                        setNewType('AUXILIARY');
                        break;
                      default:
                        throw new Error(`invalid type ${event.target.value} passed to newType`);
                    }
                  }}
                >
                  <option value='ABSTRACT'>abstract</option>
                  <option value='STRUCTURAL'>structural</option>
                  <option value='AUXILIARY'>auxiliary</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                required attributes
              </td>
              <td>
                <NewLdapAttributeValues<TextboxWithDropDownAutoCompeletePropsType>
                  newValues={newReqAttributes}
                  setNewValues={setNewReqAttributes}
                  CustomInput={TextboxWithDropDownAutoCompelete}
                  customInputProps={{
                    dropdownStrings: attributeTypeNames,
                    onAutoCompelete: () => { return; }
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                optional attributes
              </td>
              <td>
                <NewLdapAttributeValues<TextboxWithDropDownAutoCompeletePropsType>
                  newValues={newOptAttributes}
                  setNewValues={setNewOptAttributes}
                  CustomInput={TextboxWithDropDownAutoCompelete}
                  customInputProps={{
                    dropdownStrings: attributeTypeNames,
                    onAutoCompelete: () => { return; }
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button className='negativeButton' type='button' onClick={() => {
          setNewOid('');
          setNewNames([]);
          setNewDescription('');
          setNewSuperiorObjectClasses([
            {
              id: uuid(),
              value: 'top'
            }
          ]);
          setNewType('STRUCTURAL');
          setNewReqAttributes([]);
          setNewOptAttributes([]);
          setOidGenerated(false);
        }} >reset</button>
        <button className='positiveButton' type='button' onClick={() => {
          setOnConfirmScreen(true);
        }}>add</button>
      </> : <>
        object classes cannot be deleted once created
        <br></br>
        <button className='negativeButton' type='button' onClick={() => {
          setOnConfirmScreen(false);
        }}>cancel</button>
        <button type='submit' className='positiveButton'>confirm</button>
      </>}
    </form>
  );
};

export default NewObjectClassSchemaForm;
