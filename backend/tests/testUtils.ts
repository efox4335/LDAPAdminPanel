import expect from 'expect';

import type { addReq, bindReq, clientReq, delReq, searchReq } from '../src/utils/types';

export const serverUrl = 'ldap://localhost:1389';

export const invalidClientId: string = 'abcdef';

export const baseDn = 'dc=example,dc=org';

export const basicNewClient: clientReq = {
  url: serverUrl
};

export const validBind: bindReq = {
  dnOrSaslMechanism: `cn=admin,${baseDn}`,
  password: 'password'
};

export const customErrorMessageValidator = (error: unknown, expectedError: string) => {
  if (typeof (error) !== 'string') {
    throw new Error('error is not of type string');
  }

  expect(error).toStrictEqual(expectedError);
};

export const basicSearch: searchReq = {
  baseDn: '',

  options: {
    //to check newly created entries in testing
    scope: 'base',
    //matches any entry
    filter: '(objectClass=*)',
    derefAliases: 'never',
    sizeLimit: 0,
    timeLimit: 10,
    paged: false,
    //allows checking of entire entry during testing
    attributes: ['*', '+']
  }
};

export const testUserDn: string = 'ou=users,dc=example,dc=org';

export const basicAdd: addReq = {
  baseDn: testUserDn,

  entry: {
    objectClass: 'person',
    cn: 'test',
    sn: 'test'
  }
};

export const basicDel: delReq = {
  dn: testUserDn
};
