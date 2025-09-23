/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import test, { afterEach, beforeEach } from 'node:test';
import { describe } from 'node:test';
import supertest from 'supertest';
import expect from 'expect';

import app from '../../../src/app';
import { basicNewClient, invalidClientId, adminBind, baseDn, customErrorMessageValidator, basicSearch, basicAdd, basicDel, testClients } from '../../testUtils';

describe('ldapdbs endpoint tests', () => {
  describe('new client tests', (): void => {
    describe('ldap dp url tests', () => {
      test('correct url', async () => {
        const rsp = await supertest(app)
          .post('/ldapdbs/')
          .send(basicNewClient)
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

        customErrorMessageValidator(rsp.body.error, 'url is invalid');
      });
    });
  });

  describe('bind tests', () => {
    let clientId: string;

    beforeEach(async () => {
      const rsp = await supertest(app)
        .post('/ldapdbs/')
        .send(basicNewClient);

      clientId = rsp.body.id;
    });

    afterEach(async () => {
      await supertest(app).delete(`/ldapdbs/${clientId}`);
    });

    test('no client', async () => {
      const rsp = await supertest(app)
        .put(`/ldapdbs/${invalidClientId}/bind`)
        .send(adminBind)
        .expect(404);

      customErrorMessageValidator(rsp.body.error, 'cannot bind: no client exists');
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
          .send({ ...adminBind, password: 'wrong' })
          .expect(401);

        expect(rsp.body.originalError).toStrictEqual({ code: 49, name: 'InvalidCredentialsError' });
        customErrorMessageValidator(rsp.body.error, 'cannot bind: invalid credentials');
      } finally {
        await supertest(app).put(`/ldapdbs/${clientId}/unbind`);
      }
    });

    test('invalid dn syntax', async () => {
      try {
        const rsp = await supertest(app)
          .put(`/ldapdbs/${clientId}/bind`)
          .send({ ...adminBind, dnOrSaslMechanism: 'abcdef' })
          .expect(400);

        expect(rsp.body.originalError).toStrictEqual({ code: 34, name: 'InvalidDNSyntaxError' });
        customErrorMessageValidator(rsp.body.error, 'cannot bind: invalid dn syntax');
      } finally {
        await supertest(app).put(`/ldapdbs/${clientId}/unbind`);
      }
    });

    test('invalid dn', async () => {
      try {
        const rsp = await supertest(app)
          .put(`/ldapdbs/${clientId}/bind`)
          .send({ ...adminBind, dnOrSaslMechanism: baseDn })
          .expect(401);

        customErrorMessageValidator(rsp.body.error, 'cannot bind: invalid credentials');
      } finally {
        await supertest(app).put(`/ldapdbs/${clientId}/unbind`);
      }
    });

    test('successful request', async () => {
      try {
        await supertest(app)
          .put(`/ldapdbs/${clientId}/bind`)
          .send(adminBind)
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
        .send(basicNewClient);

      clientId = rsp.body.id;
    });

    afterEach(async () => {
      await supertest(app).delete(`/ldapdbs/${clientId}`);
    });

    test('invalid client id', async () => {
      const rsp = await supertest(app)
        .put(`/ldapdbs/${invalidClientId}/unbind`)
        .expect(404);

      customErrorMessageValidator(rsp.body.error, 'cannot unbind: no client exists');
    });

    test('client already unbound', async () => {
      await supertest(app)
        .put(`/ldapdbs/${clientId}/bind`)
        .send(adminBind);

      await supertest(app).put(`/ldapdbs/${clientId}/unbind`);

      const rsp = await supertest(app)
        .put(`/ldapdbs/${clientId}/unbind`)
        .expect(409);

      customErrorMessageValidator(rsp.body.error, 'cannot unbind: client is not connected');
    });

    test('valid unbind', async () => {
      await supertest(app)
        .put(`/ldapdbs/${clientId}/bind`)
        .send(adminBind);

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

      customErrorMessageValidator(rsp.body.error, 'cannot delete: no client exists');

      describe('client required tests', () => {
        let clientId: string;

        beforeEach(async () => {
          const rsp = await supertest(app)
            .post('/ldapdbs/')
            .send(basicNewClient);

          clientId = rsp.body.id;
        });

        test('client connected', async () => {
          await supertest(app)
            .put(`/ldapdbs/${clientId}/bind`)
            .send(adminBind);

          try {
            const rsp = await supertest(app)
              .delete(`/ldapdbs/${clientId}`)
              .expect(409);

            customErrorMessageValidator(rsp.body.error, 'cannot delete: client has active connection to database');
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

  describe('search tests', () => {
    test('no client', async () => {
      const rsp = await supertest(app)
        .post(`/ldapdbs/${invalidClientId}/search`)
        .send(basicSearch)
        .expect(404);

      customErrorMessageValidator(rsp.body.error, 'cannot search: no client exists');
    });

    describe('client required', () => {
      const clients = new testClients;

      beforeEach(async () => {
        await clients.addClients(app);
      });

      afterEach(async () => {
        await clients.delClients(app);
      });

      test('unbound search', async () => {
        const rsp = await supertest(app)
          .post(`/ldapdbs/${clients.adminClient}/search`)
          .send(basicSearch)
          .expect(409);

        customErrorMessageValidator(rsp.body.error, 'cannot search: client is not connected');
      });

      describe('bound client', () => {
        beforeEach(async () => {
          await clients.bindClients(app);
        });

        afterEach(async () => {
          await clients.unbindClients(app);
        });

        test('invalid body', async () => {
          await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/search`)
            .send({ client: 'abc' })
            .expect(400);
        });

        test('non existent dn', async () => {
          const rsp = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/search`)
            .send({ ...basicSearch, baseDn: 'dc=abc' })
            .expect(404);

          expect(rsp.body.originalError).toStrictEqual({ code: 32, name: 'NoSuchObjectError' });
          customErrorMessageValidator(rsp.body.error, 'cannot search: base dn does not match any in server');
        });

        test('invalid dn syntax', async () => {
          const rsp = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/search`)
            .send({ ...basicSearch, baseDn: 'abcdef' })
            .expect(400);

          expect(rsp.body.originalError).toStrictEqual({ code: 34, name: 'InvalidDNSyntaxError' });
          customErrorMessageValidator(rsp.body.error, 'cannot search: base dn syntax is invalid');
        });

        test('correct search', async () => {
          const rsp = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/search`)
            .send(basicSearch)
            .expect(200);

          expect(rsp.body).toBeDefined();
          expect(rsp.body.searchEntries).toBeDefined();
          expect(rsp.body.searchEntries[0]).toBeDefined();
          expect(rsp.body.searchEntries[0].namingContexts).toBeDefined();
          expect(rsp.body.searchEntries[0].namingContexts).toStrictEqual('dc=example,dc=org');
        });
      });
    });
  });

  describe('add tests', () => {
    test('no client', async () => {
      const rsp = await supertest(app)
        .post(`/ldapdbs/${invalidClientId}/add`)
        .send(basicAdd)
        .expect(404);

      customErrorMessageValidator(rsp.body.error, 'cannot add: no client exists');
    });

    describe('client required', () => {
      const clients = new testClients;

      beforeEach(async () => {
        await clients.addClients(app);
      });

      afterEach(async () => {
        await clients.delClients(app);
      });

      test('unbound client', async () => {
        const rsp = await supertest(app)
          .post(`/ldapdbs/${clients.adminClient}/add`)
          .send(basicAdd)
          .expect(409);

        customErrorMessageValidator(rsp.body.error, 'cannot add: client is not connected');

        const conStat = await supertest(app).get(`/ldapdbs/${clients.adminClient}`);

        expect(conStat.body.isConnected).toStrictEqual(false);
      });

      describe('bound client', () => {
        beforeEach(async () => {
          await clients.bindClients(app);
        });

        afterEach(async () => {
          await clients.unbindClients(app);
        });

        test('invalid body', async () => {
          await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/add`)
            .send({ abc: 'def' })
            .expect(400);
        });

        test('invalid dn syntax', async () => {
          const rsp = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/add`)
            .send({ ...basicAdd, baseDn: 'abcdef' })
            .expect(400);

          expect(rsp.body.originalError).toStrictEqual({ code: 34, name: 'InvalidDNSyntaxError' });
          customErrorMessageValidator(rsp.body.error, 'cannot add: base dn syntax is invalid');
        });

        test('non existent dn', async () => {
          const rsp = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/add`)
            .send({ ...basicAdd, baseDn: 'cn=test,dc=invaliddn,dc=example,dc=org' })
            .expect(400);

          expect(rsp.body.originalError).toStrictEqual({ code: 32, name: 'NoSuchObjectError' });
          customErrorMessageValidator(rsp.body.error, 'cannot add: base dn does not exist');
        });

        test('undefined attribute', async () => {
          const rsp = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/add`)
            .send({ ...basicAdd, entry: { ...basicAdd.entry, invalidAttribute: 'abc' } })
            .expect(400);

          expect(rsp.body.originalError).toStrictEqual({ code: 17, name: 'UndefinedTypeError' });
          customErrorMessageValidator(rsp.body.error, 'cannot add: attributes given do not match schema');
        });

        test('correct add', async () => {
          await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/add`)
            .send(basicAdd)
            .expect(201);

          await supertest(app)
            .delete(`/ldapdbs/${clients.adminClient}/del`)
            .send(basicDel);
        });
      });
    });
  });

  describe('client info tests', () => {
    test('no client', async () => {
      const rsp = await supertest(app)
        .get(`/ldapdbs/${invalidClientId}`)
        .expect(404);

      customErrorMessageValidator(rsp.body.error, 'no client exists');
    });

    describe('client required', () => {
      const clients = new testClients;

      beforeEach(async () => {
        await clients.addClients(app);
      });

      afterEach(async () => {
        await clients.delClients(app);
      });

      test('not connected', async () => {
        const rsp = await supertest(app)
          .get(`/ldapdbs/${clients.adminClient}`)
          .expect(200);

        expect(rsp.body).toBeDefined();
        expect(rsp.body.isConnected).toBeDefined();
        expect(rsp.body.isConnected).toStrictEqual(false);
      });

      describe('bind required', () => {
        beforeEach(async () => {
          await clients.bindClients(app);
        });

        afterEach(async () => {
          await clients.unbindClients(app);
        });

        test('client connected', async () => {
          const rsp = await supertest(app)
            .get(`/ldapdbs/${clients.adminClient}`)
            .expect(200);

          expect(rsp.body).toBeDefined();
          expect(rsp.body.isConnected).toBeDefined();
          expect(rsp.body.isConnected).toStrictEqual(true);
        });
      });
    });
  });
});
