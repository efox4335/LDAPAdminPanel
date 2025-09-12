/* eslint-disable @typescript-eslint/no-floating-promises */
import test from 'node:test';
import { describe } from 'node:test';
import supertest from 'supertest';

import app from '../../src/app';

describe('client endpoint tests', (): void => {
  describe('ldap dp url tests', () => {
    test('object passed', async () => {
      await supertest(app).post('/ldapdb/client').send({ str: 'abcdef' }).expect(400);
    });
  });
});
