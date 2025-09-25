import expect from 'expect';
import supertest from 'supertest';
import { Express } from 'express';

import type { addReq, bindReq, clientReq, compareReq, delReq, exopReq, modifyReq, searchReq } from '../src/utils/types';

export const serverUrl = 'ldap://localhost:1389';

export const invalidClientId: string = 'abcdef';

export const baseDn = 'dc=example,dc=org';

export const basicNewClient: clientReq = {
  url: serverUrl
};

export const adminBind: bindReq = {
  dnOrSaslMechanism: `cn=admin,${baseDn}`,
  password: 'password'
};

export const customErrorMessageValidator = (error: unknown, expectedError: string) => {
  if (typeof (error) !== 'object') {
    throw new Error('error is not of type object');
  }

  if (!error) {
    throw new Error('error is falsy');
  }

  if (!('message' in error)) {
    throw new Error('no message in error');
  }

  if (!('type' in error)) {
    throw new Error('no type in error');
  }

  expect(error.type).toStrictEqual('customErrorMessage');
  expect(error.message).toStrictEqual(expectedError);
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

export const testUserDn: string = 'cn=test,ou=users,dc=example,dc=org';

export const basicAdd: addReq = {
  baseDn: testUserDn,

  entry: {
    objectClass: 'person',
    cn: 'test',
    sn: 'test'
  }
};

export const basicCompare: compareReq = {
  dn: testUserDn,
  attribute: 'cn',
  value: 'test'
};

export const unavailableCriticalValiadator = (error: unknown) => {
  if (typeof (error) !== 'object') {
    throw new Error('error is not of type object');
  }

  if (!error) {
    throw new Error('error is falsy');
  }

  if (!('type' in error)) {
    throw new Error('no type in error');
  }

  if (!('code' in error)) {
    throw new Error('no code in error');
  }

  if (!('name' in error)) {
    throw new Error('no name in error');
  }

  expect(error.type).toStrictEqual('ldapError');
  expect(error.code).toStrictEqual(12);
  expect(error.name).toStrictEqual('UnavailableCriticalExtensionError');
};

export const basicDel: delReq = {
  dn: testUserDn
};

export const basicExop: exopReq = {
  oid: '1.3.6.1.4.1.4203.1.11.3' //who am i request
};

export const basicModify: modifyReq = {
  dn: testUserDn,
  changes: [{
    operation: 'replace',
    type: 'sn',
    values: ['newName']
  }]
};

export const validateBasicModify: compareReq = {
  dn: testUserDn,
  attribute: 'sn',
  value: 'newName'
};

export class testClients {
  public adminClient: string;

  constructor() {
    this.adminClient = '';
  }

  async addClients(app: Express) {
    const rsp = await supertest(app).post('/ldapdbs').send(basicNewClient);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    this.adminClient = rsp.body.id;
  }

  async delClients(app: Express) {
    await supertest(app).delete(`/ldapdbs/${this.adminClient}`);
  }

  async bindClients(app: Express) {
    await supertest(app).put(`/ldapdbs/${this.adminClient}/bind`).send(adminBind);
  }

  async unbindClients(app: Express) {
    await supertest(app).put(`/ldapdbs/${this.adminClient}/unbind`);
  }

  async addEntries(app: Express) {
    await supertest(app).post(`/ldapdbs/${this.adminClient}/add`).send(basicAdd);
  }

  async delEntries(app: Express) {
    await supertest(app).delete(`/ldapdbs/${this.adminClient}/del`).send(basicDel);
  }
};

//testing a failed critical control allows reuse for all endpoints
export const testControl = [{
  type: '1.2',
  critical: true

}];
