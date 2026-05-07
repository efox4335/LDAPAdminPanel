import { useState, type Dispatch, type SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';

import type {
  objectClassType,
  schemaType,
  newLdapAttributeValue,
  objectClassSchema,
  attributeTypeSchema,
  attributeTypeUsage,
  newLdapAttribute,
  ldapSchemaExtension
} from '../utils/types';
import TextboxWithDropDownAutoCompelete, { type TextboxWithDropDownAutoCompeletePropsType } from './TextboxWithDropDownAutoCompelete';
import getAttributeValues from '../utils/getAttributeValues';
import NewLdapAttributeValues from './NewLdapAttributeValues';
import NewAttributeList from './NewAttributeList';

const NewSchemaForm = ({ handleSubmit, objectClassNames, attributeTypeNames, id }:
  {
    handleSubmit: (arg0: objectClassSchema | attributeTypeSchema, arg1: schemaType, arg2: string) => void,
    objectClassNames: string[],
    attributeTypeNames: string[],
    id: string
  }
) => {
  const [curSchemaType, setCurSchemaType] = useState<schemaType>('objectClass');

  return (
    <div>
      schema type
      <select value={curSchemaType} onChange={(event) => setCurSchemaType(event.target.value as schemaType)}>
        <option value='objectClass'>object class</option>
        <option value='attributeType'>attribute type</option>
      </select>
      <br></br>
      {(curSchemaType === 'objectClass') ?
        <NewObjectClassSchemaForm
          handleSubmit={(schema) => handleSubmit(schema, 'objectClass', id)}
          objectClassNames={objectClassNames}
          attributeTypeNames={attributeTypeNames}
        /> : <></>}
      {(curSchemaType === 'attributeType') ?
        <NewAttributeTypeSchemaForm
          handleSubmit={(schema) => handleSubmit(schema, 'attributeType', id)}
        /> : <></>}
    </div>
  );
};

const NewOidInput = ({ newOid, setNewOid, oidGenerated, setOidGenerated }:
  {
    newOid: string,
    setNewOid: Dispatch<SetStateAction<string>>,
    oidGenerated: boolean,
    setOidGenerated: Dispatch<SetStateAction<boolean>>
  }) => {
  return (
    <>
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
    </>
  );
};

const NewAttributeTypeSchemaForm = ({ handleSubmit }: { handleSubmit: (arg0: attributeTypeSchema) => void }) => {
  const [newOid, setNewOid] = useState<string>('');

  const [oidGenerated, setOidGenerated] = useState<boolean>(false);

  const [newNames, setNewNames] = useState<newLdapAttributeValue[]>([]);

  const [newDescription, setNewDescription] = useState<string>('');

  const [newObsolete, setNewObsolete] = useState<boolean>(false);

  const [newSupAttributeType, setNewSupAttributeType] = useState<string>('');

  const [newEqMatchingRule, setNewEqMatchingRule] = useState<string>('');

  const [newOrdMatchingRule, setNewOrdMatchingRule] = useState<string>('');

  const [newSubStrMatchingRule, setNewSubStrMatchingRule] = useState<string>('');

  const [newAttributeSyntax, setNewAttributeSyntax] = useState<string>('');

  const [newAttributeSize, setNewAttributeSize] = useState<string>('');

  const [newSingleValue, setNewSingleValue] = useState<boolean>(false);

  const [newCollective, setNewCollective] = useState<boolean>(false);

  const [newNoUserMod, setNewNoUserMod] = useState<boolean>(false);

  const [newUsage, setNewUsage] = useState<attributeTypeUsage | 'none'>('none');

  const [newExtensions, setNewExtensions] = useState<newLdapAttribute[]>([]);

  const [onConfirmScreen, setOnConfirmScreen] = useState<boolean>(false);

  const handleReset = () => {
    setNewOid('');
    setOidGenerated(false);
    setNewNames([]);
    setNewDescription('');
    setNewObsolete(false);
    setNewSupAttributeType('');
    setNewEqMatchingRule('');
    setNewOrdMatchingRule('');
    setNewSubStrMatchingRule('');
    setNewAttributeSyntax('');
    setNewAttributeSize('');
    setNewSingleValue(false);
    setNewCollective(false);
    setNewNoUserMod(false);
    setNewUsage('none');
    setNewExtensions([]);
  };

  return (
    <form onSubmit={(event) => {
      event.preventDefault();

      const gottenNewNames = getAttributeValues(newNames);

      const gottenNewExtensions: ldapSchemaExtension[] = newExtensions
        .filter((ele) => ele.attributeName !== '')
        .map((ele) => {
          return {
            name: ele.attributeName,
            value: getAttributeValues(ele.values)
          };
        });

      handleSubmit({
        oid: newOid,
        name: (gottenNewNames.length === 0 || gottenNewNames[0] === '') ? undefined : gottenNewNames,
        description: (newDescription === '') ? undefined : newDescription,
        obsolete: newObsolete,
        superiorAttributeType: (newSupAttributeType === '') ? undefined : newSupAttributeType,
        eqMatchingRule: (newEqMatchingRule === '') ? undefined : newEqMatchingRule,
        ordMatchingRule: (newOrdMatchingRule === '') ? undefined : newOrdMatchingRule,
        subStrMatchingRule: (newSubStrMatchingRule === '') ? undefined : newSubStrMatchingRule,
        attributeSyntax: (newAttributeSyntax === '') ? undefined : {
          oid: newAttributeSyntax,
          size: (newAttributeSize === '') ? undefined : Number(newAttributeSize)
        },
        singleValue: newSingleValue,
        collective: newCollective,
        noUserMod: newNoUserMod,
        usage: (newUsage === 'none') ? undefined : newUsage,
        extensions: (gottenNewExtensions.length === 0) ? undefined : gottenNewExtensions
      });
    }}>
      {!onConfirmScreen ? <>
        <table>
          <tbody>
            <tr>
              <td>
                oid
              </td>
              <td>
                <NewOidInput newOid={newOid} setNewOid={setNewOid} oidGenerated={oidGenerated} setOidGenerated={setOidGenerated} />
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
                superior attribute type
              </td>
              <td>
                <input type='textbox' value={newSupAttributeType} onChange={(e) => setNewSupAttributeType(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td>
                equality matching rule
              </td>
              <td>
                <input type='textbox' value={newEqMatchingRule} onChange={(e) => setNewEqMatchingRule(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td>
                substring matching rule
              </td>
              <td>
                <input type='textbox' value={newSubStrMatchingRule} onChange={(e) => setNewSubStrMatchingRule(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td>
                attribute syntax
              </td>
              <td>
                <input type='textbox' value={newAttributeSyntax} onChange={(e) => setNewAttributeSyntax(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td>
                attribute size
              </td>
              <td>
                <div>
                  <input type='textbox' value={newAttributeSize} onChange={(e) => {
                    const valString = e.target.value;

                    if (valString === '') {
                      setNewAttributeSize('');

                      return;
                    }

                    const newVal = Number(valString);

                    if (!Number.isInteger(newVal) || newVal < 0) {
                      return;
                    }

                    setNewAttributeSize(e.target.value);
                  }} />
                </div>
                <div>
                  {(newAttributeSyntax === '' && newAttributeSize !== '') ? <>
                    *attribute size is only applied if attribute syntax is filled
                  </> : <></>}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                single value
              </td>
              <td>
                <select
                  value={newSingleValue.toString()}
                  onChange={(event) => {
                    if (event.target.value === 'true') {
                      setNewSingleValue(true);
                    } else {
                      setNewSingleValue(false);
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
                collective
              </td>
              <td>
                <select
                  value={newCollective.toString()}
                  onChange={(event) => {
                    if (event.target.value === 'true') {
                      setNewCollective(true);
                    } else {
                      setNewCollective(false);
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
                no user modification
              </td>
              <td>
                <select
                  value={newNoUserMod.toString()}
                  onChange={(event) => {
                    if (event.target.value === 'true') {
                      setNewNoUserMod(true);
                    } else {
                      setNewNoUserMod(false);
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
                usage
              </td>
              <td>
                <select
                  value={newUsage}
                  onChange={(e) => {
                    setNewUsage(e.target.value as attributeTypeUsage | 'none');
                  }
                  }>
                  <option value='none'>none</option>
                  <option value='USERAPPLICATIONS'>userApplications</option>
                  <option value='DIRECTORYOPERATION'>directoryOperation</option>
                  <option value='DISTRIBUTEDOPERATION'>distributedOperation</option>
                  <option value='DSAOPERATION'>dSAOperation</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                extensions
              </td>
              <td>
                <NewAttributeList newAttributes={newExtensions} setNewAttributes={setNewExtensions} />
              </td>
            </tr>
          </tbody>
        </table>
        <button className='negativeButton' type='button' onClick={() => handleReset()} >reset</button>
        <button className='positiveButton' type='button' onClick={() => {
          setOnConfirmScreen(true);
        }}>add</button>
      </> : <>
        attribute types cannot be deleted once created
        <br></br>
        <button className='negativeButton' type='button' onClick={() => {
          setOnConfirmScreen(false);
        }}>cancel</button>
        <button type='submit' className='positiveButton'>confirm</button>
      </>}
    </form >
  );
};

const NewObjectClassSchemaForm = ({ handleSubmit, objectClassNames, attributeTypeNames }:
  {
    handleSubmit: (arg0: objectClassSchema) => void,
    objectClassNames: string[],
    attributeTypeNames: string[],
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

  const [oidGenerated, setOidGenerated] = useState<boolean>(false);

  const [newType, setNewType] = useState<objectClassType>('STRUCTURAL');

  const [newReqAttributes, setNewReqAttributes] = useState<newLdapAttributeValue[]>([]);

  const [newOptAttributes, setNewOptAttributes] = useState<newLdapAttributeValue[]>([]);

  const [newObsolete, setNewObsolete] = useState<boolean>(false);


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
      });
    }}>
      {!onConfirmScreen ? <>
        <table>
          <tbody>
            <tr className='headlessFirstTableRow'>
              <td>
                oid
              </td>
              <td>
                <NewOidInput newOid={newOid} setNewOid={setNewOid} oidGenerated={oidGenerated} setOidGenerated={setOidGenerated} />
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

export default NewSchemaForm;
