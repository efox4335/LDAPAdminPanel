/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
import test, { afterEach, beforeEach } from 'node:test';
import { describe } from 'node:test';
import supertest from 'supertest';
import expect from 'expect';

import app from '../../../src/app';
import { serverUrl, invalidClientId, validBind, baseDn } from '../../testUtils';

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

  describe('bind tests', () => {
    let clientId: string;

    beforeEach(async () => {
      const rsp = await supertest(app)
        .post('/ldapdbs/')
        .send({ url: serverUrl });

      clientId = rsp.body.id;
    });

    afterEach(async () => {
      await supertest(app).delete(`/ldapdbs/${clientId}`);
    });

    test('no client', async () => {
      const rsp = await supertest(app)
        .put(`/ldapdbs/${invalidClientId}/bind`)
        .send(validBind)
        .expect(404);

      expect(rsp.body.error).toBeDefined();
      expect(typeof (rsp.body.error)).toStrictEqual('string');
      expect(rsp.body.error).toStrictEqual('cannot bind: no client exists');
    });

    test('invalid request', async () => {
      await supertest(app)
        .put(`/ldapdbs/${clientId}/bind`)
        .expect(400);
    });

    test('wrong password', async () => {
      try {
        const rsp = await supertest(app)
          .put(`/ldapdbs/${clientId}/bind`)
          .send({ ...validBind, password: 'wrong' })
          .expect(401);

        expect(rsp.body.error).toBeDefined();
        expect(typeof (rsp.body.error)).toStrictEqual('string');
        expect(rsp.body.error).toStrictEqual('cannot bind: invalid credentials');
      } finally {
        await supertest(app).put(`/ldapdbs/${clientId}/unbind`);
      }
    });

    test('invalid dn syntax', async () => {
      try {
        const rsp = await supertest(app)
          .put(`/ldapdbs/${clientId}/bind`)
          .send({ ...validBind, dnOrSaslMechanism: 'abcdef' })
          .expect(400);

        expect(rsp.body.error).toBeDefined();
        expect(typeof (rsp.body.error)).toStrictEqual('string');
        expect(rsp.body.error).toStrictEqual('cannot bind: invalid dn syntax');
      } finally {
        await supertest(app).put(`/ldapdbs/${clientId}/unbind`);
      }
    });

    test('invalid dn', async () => {
      try {
        const rsp = await supertest(app)
          .put(`/ldapdbs/${clientId}/bind`)
          .send({ ...validBind, dnOrSaslMechanism: baseDn })
          .expect(401);

        expect(rsp.body.error).toBeDefined();
        expect(typeof (rsp.body.error)).toStrictEqual('string');
        expect(rsp.body.error).toStrictEqual('cannot bind: invalid credentials');
      } finally {
        await supertest(app).put(`/ldapdbs/${clientId}/unbind`);
      }
    });

    test('successful request', async () => {
      try {
        await supertest(app)
          .put(`/ldapdbs/${clientId}/bind`)
          .send(validBind)
          .expect(200);
      } finally {
        await supertest(app).put(`/ldapdbs/${clientId}/unbind`);
      }
    });
  });

  describe('unbind tests', () => {
    let clientId: string;

    beforeEach(async () => {
      const rsp = await supertest(app)
        .post('/ldapdbs/')
        .send({ url: serverUrl });

      clientId = rsp.body.id;
    });

    afterEach(async () => {
      await supertest(app).delete(`/ldapdbs/${clientId}`);
    });

    test('invalid client id', async () => {
      const rsp = await supertest(app)
        .put(`/ldapdbs/${invalidClientId}/unbind`)
        .expect(404);

      expect(rsp.body.error).toBeDefined();
      expect(typeof (rsp.body.error)).toStrictEqual('string');
      expect(rsp.body.error).toStrictEqual('cannot unbind: no client exists');
    });

    test('client already unbound', async () => {
      await supertest(app)
        .put(`/ldapdbs/${clientId}/bind`)
        .send(validBind);

      await supertest(app).put(`/ldapdbs/${clientId}/unbind`);

      const rsp = await supertest(app)
        .put(`/ldapdbs/${clientId}/unbind`)
        .expect(409);

      expect(rsp.body.error).toBeDefined();
      expect(typeof (rsp.body.error)).toStrictEqual('string');
      expect(rsp.body.error).toStrictEqual('cannot unbind: client is not connected');
    });

    test('valid unbind', async () => {
      await supertest(app)
        .put(`/ldapdbs/${clientId}/bind`)
        .send(validBind);

      await supertest(app)
        .put(`/ldapdbs/${clientId}/unbind`)
        .expect(200);
    });
  });

  describe('delete client tests', () => {
    test('no client', async () => {
      const rsp = await supertest(app)
        .delete(`/ldapdbs/${invalidClientId}`)
        .expect(404);

      expect(rsp.body.error).toBeDefined();
      expect(typeof (rsp.body.error)).toStrictEqual('string');
      expect(rsp.body.error).toStrictEqual('cannot delete: no client exists');

      describe('client required tests', () => {
        let clientId: string;

        beforeEach(async () => {
          const rsp = await supertest(app)
            .post('/ldapdbs/')
            .send({ url: serverUrl });

          clientId = rsp.body.id;
        });

        test('client connected', async () => {
          await supertest(app)
            .put(`/ldapdbs/${clientId}/bind`)
            .send(validBind);

          try {
            const rsp = await supertest(app)
              .delete(`/ldapdbs/${clientId}`)
              .expect(409);

            expect(rsp.body.error).toBeDefined();
            expect(typeof (rsp.body.error)).toStrictEqual('string');
            expect(rsp.body.error).toStrictEqual('cannot delete: client has active connection to database');
          } finally {
            await supertest(app).put(`/ldapdbs/${clientId}/unbind`);
            await supertest(app).delete(`/ldapdbs/${clientId}`);
          }
        });

        test('successful delete', async () => {
          await supertest(app)
            .delete(`/ldapdbs/${clientId}`)
            .expect(204);
        });
      });
    });
  });
});
