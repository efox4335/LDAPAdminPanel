/* eslint-disable @typescript-eslint/no-floating-promises */
import test from 'node:test';
import { describe } from 'node:test';
import supertest from 'supertest';

import app from '../../../src/app';
import { serverUrl } from '../../testUtils';

describe('ldapdbs endpoint tests', () => {
  describe('new client tests', (): void => {
    describe('ldap dp url tests', () => {
      test('correct url', async () => {
        await supertest(app)
          .post('/ldapdbs/')
          .send({ url: serverUrl })
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
});
