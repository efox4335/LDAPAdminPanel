/* eslint-disable @typescript-eslint/no-floating-promises */
import test from 'node:test';
import { describe } from 'node:test';
import supertest from 'supertest';

import app from '../../src/app';

describe('new client tests', (): void => {
  describe('ldap dp url tests', () => {
    test('correct url', async () => {
      await supertest(app)
        .post('/ldapdbs/')
        .send({ url: 'ldap://localhost:1389' })
        .expect(201);
    });
    test('object passed', async () => {
      await supertest(app)
        .post('/ldapdbs/')
        .send({ str: 'abcdef' })
        .expect(400);
    });
  });
});
