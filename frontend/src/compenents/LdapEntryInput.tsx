import type { Dispatch, SetStateAction } from 'react';
import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { v4 as uuidv4 } from 'uuid';

import NewLdapAttributeValues from './NewLdapAttributeValues';
import NewAttributeList from './NewAttributeList';
import type { newLdapAttributeValue, newLdapAttribute } from '../utils/types';
import TextboxWithDropDownAutoCompelete from './TextboxWithDropDownAutoCompelete';
import type { TextboxWithDropDownAutoCompeletePropsType } from './TextboxWithDropDownAutoCompelete';
import { selectInheritedObjectClassesByClientId, selectAttributeTypesByClientId } from '../slices/client';
import getObjectClassFromNameMap from '../utils/getObjectClassFromNameMap';

const LdapEntryInput = (
  {
    clientId,
    newDn,
    setNewDn,
    newObjectClasses,
    setNewObjectClasses,
    newAttributes,
    setNewAttributes
  }: {
    clientId: string,
    newDn: string,
    setNewDn: Dispatch<SetStateAction<string>>,
    newObjectClasses: newLdapAttributeValue[],
    setNewObjectClasses: Dispatch<SetStateAction<newLdapAttributeValue[]>>,
    newAttributes: newLdapAttribute[],
    setNewAttributes: Dispatch<SetStateAction<newLdapAttribute[]>>
  }
) => {
  const objectClasses = useSelector((state) => selectInheritedObjectClassesByClientId(state, clientId));

  const attributeTypeSchemas = useSelector((state) => selectAttributeTypesByClientId(state, clientId));

  let objectClassNames: string[] = [];

  if (objectClasses !== undefined) {
    const oids: string[] = [];

    objectClasses.objectClassSchemas.forEach((objectClass) => {
      if (objectClass.names !== undefined) {
        objectClassNames = objectClassNames.concat(objectClass.names);

        oids.push(objectClass.oid);
      }
    });

    objectClassNames = objectClassNames.concat(oids);
  }

  const handelAutoCompelete = (name: string) => {
    if (objectClasses === undefined || attributeTypeSchemas === undefined) {
      return;
    }

    const curObjectClass = getObjectClassFromNameMap(objectClasses, name);

    if (curObjectClass === undefined) {
      return;
    }

    const attributesToAdd: string[] = [];

    if (curObjectClass.reqAttributes !== undefined) {
      attributesToAdd.push(...curObjectClass.reqAttributes);
    }

    if (curObjectClass.optAttributes !== undefined) {
      attributesToAdd.push(...curObjectClass.optAttributes);
    }

    const curAttributes = newAttributes.map((attribute) => attribute.attributeName);

    curAttributes.push('objectClass');

    const curAddedAttributMap: Record<string, boolean> = {};

    curAttributes.forEach((attribute) => {
      const attributeTypeSchemaIndex = attributeTypeSchemas.nameMap[attribute.toLowerCase()];

      if (attributeTypeSchemaIndex !== undefined) {
        curAddedAttributMap[attributeTypeSchemaIndex.toString()] = true;
      }
    });

    const formattedAttributesToAdd: newLdapAttribute[] = [];

    attributesToAdd.forEach((attribute) => {
      const attributeTypeSchemaIndex = attributeTypeSchemas.nameMap[attribute.toLowerCase()];

      if (attributeTypeSchemaIndex !== undefined) {
        if (curAddedAttributMap[attributeTypeSchemaIndex.toString()] !== true) {
          curAddedAttributMap[attributeTypeSchemaIndex.toString()] = true;
        } else {
          return;
        }
      }

      formattedAttributesToAdd.push(
        {
          id: uuidv4(),
          attributeName: attribute,
          values: []
        }
      );
    });

    setNewAttributes([...formattedAttributesToAdd, ...newAttributes]);
  };

  return (
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
        <tr>
          <td>
            objectClass
          </td>
          <td>
            <NewLdapAttributeValues<TextboxWithDropDownAutoCompeletePropsType>
              newValues={newObjectClasses}
              setNewValues={setNewObjectClasses}
              CustomInput={TextboxWithDropDownAutoCompelete}
              customInputProps={{
                dropdownStrings: objectClassNames,
                onAutoCompelete: handelAutoCompelete
              }}
            />
          </td>
        </tr>
        <NewAttributeList newAttributes={newAttributes} setNewAttributes={setNewAttributes} />
      </tbody>
    </table>
  );
};

export default LdapEntryInput;
