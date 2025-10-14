import { v4 as uuidv4 } from 'uuid';

import type { ldapEntry, newLdapAttribute } from './types';

const getNewLdapAttributes = (entry: ldapEntry): newLdapAttribute[] => {
  return Object
    .entries(entry)
    .filter(([key]) => key !== 'dn')
    .map(([key, value]) => {
      return {
        id: uuidv4(),
        attributeName: key,
        values: (Array.isArray(value)) ?
          value.map((val) => {
            return { id: uuidv4(), value: val };
          }) :
          [{ id: uuidv4(), value: value }]
      };
    });
};

export default getNewLdapAttributes;
