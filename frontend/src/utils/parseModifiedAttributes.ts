import getAttributeValues from './getAttributeValues';
import type { ldapEntry, modifyReq, modifyReqChange, newLdapAttribute } from './types';

//dn filtered because modifyDn is required to modify it
const parseModifyedAttributes = (modifiedAttributes: newLdapAttribute[], entry: ldapEntry): modifyReq => {
  const dupCheck: Record<string, string> = {};

  modifiedAttributes.forEach(({ attributeName }) => {
    if (dupCheck[attributeName]) {
      throw new Error(`duplicate attribute name: ${attributeName}`);
    }

    dupCheck[attributeName] = attributeName;
  });

  const changeArr: modifyReqChange[] = [];

  modifiedAttributes
    .filter((attribute) => attribute.attributeName !== 'dn' && attribute.attributeName !== '')
    .forEach((attribute) => {
      const modifiedValues = getAttributeValues(attribute.values);

      if (!(attribute.attributeName in entry)) {
        changeArr.push({
          operation: 'add',
          type: attribute.attributeName,
          values: modifiedValues
        });

        return;
      }

      let existingAttribute = entry[attribute.attributeName];

      if (Array.isArray(existingAttribute)) {
        existingAttribute = existingAttribute.join(',');
      }

      //a comparison with attribute.value can't be done because the user can insert any amount of whitespace between values
      if (existingAttribute === modifiedValues.join(',')) {
        return;
      }

      changeArr.push({
        operation: 'replace',
        type: attribute.attributeName,
        values: modifiedValues
      });
    });

  Object
    .keys(entry)
    .filter((name) => name !== 'dn')
    .forEach((name) => {
      const modifiedName = modifiedAttributes.find((val) => val.attributeName === name);

      if (!modifiedName) {
        changeArr.push({
          operation: 'delete',
          type: name,
          values: []
        });
      }
    });

  return {
    dn: entry.dn,
    changes: changeArr
  };
};

export default parseModifyedAttributes;
