import type { ldapSchemaListPart } from './types';

const detLdapSchemaListPart = (curToken: string): ldapSchemaListPart => {
  switch (curToken) {
    case '(':
      return 'LISTDELIM';
    case '$':
      return 'LISTDELIM';
    case ')':
      return 'LISTEND';
    default:
      return 'VALUE';
  }
};

export default detLdapSchemaListPart;
