/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
import test from 'node:test';
import { describe } from 'node:test';
import supertest from 'supertest';
import expect from 'expect';

import app from '../../../src/app';
import { serverUrl } from '../../testUtils';

describe('ldapdbs endpoint tests', () => {
  describe('new client tests', (): void => {
    describe('ldap dp url tests', () => {
      test('correct url', async () => {
        const rsp = await supertest(app)
          .post('/ldapdbs/')
          .send({ url: serverUrl })
          .expect(201);

        expect(rsp.body.id).toBeDefined();
        expect(typeof (rsp.body.id)).toStrictEqual('string');

        //required to not pollute server with unused client
        await supertest(app)
          .delete(`/ldapbds/${rsp.body.id}`);
      });
      test('object passed', async () => {
        const rsp = await supertest(app)
          .post('/ldapdbs/')
          .send({ str: 'abcdef' })
          .expect(400);

        expect(rsp.body.error).toBeDefined();
        expect(typeof (rsp.body.error)).toStrictEqual('string');
        expect(rsp.body.error).toStrictEqual('url is invalid');
      });
    });
  });
});
