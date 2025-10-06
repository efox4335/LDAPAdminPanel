/* eslint-disable @typescript-eslint/no-floating-promises */
import test, { afterEach, beforeEach } from 'node:test';
import { describe } from 'node:test';
import supertest from 'supertest';
import expect from 'expect';

import app from '../../../src/app';
import { testClients } from '../../testUtils';

describe('error handler tests', () => {
  const clients = new testClients;

  beforeEach(async () => {
    await clients.addClients(app);
    await clients.bindClients(app);
  });

  afterEach(async () => {
    await clients.unbindClients(app);
    await clients.delClients(app);
  });

  test('ldap error', async () => {
    const res = await supertest(app)
      .post(`/ldapdbs/${clients.adminClient}/del`)
      .send({ dn: 'dc=invalidDn' })
      .expect(400);

    expect(res.body).toBeDefined();
    expect(res.body).toStrictEqual({ type: 'ldapError', code: 53, name: 'UnwillingToPerformError' });
  });
});
