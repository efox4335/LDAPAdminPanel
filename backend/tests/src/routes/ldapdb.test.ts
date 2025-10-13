/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import test, { afterEach, beforeEach } from 'node:test';
import { describe } from 'node:test';
import supertest from 'supertest';
import expect from 'expect';

import app from '../../../src/app';
import { basicNewClient, invalidClientId, adminBind, customErrorMessageValidator, basicSearch, basicAdd, basicDel, testClients, testControl, unavailableCriticalValiadator, basicExop, baseDn, basicCompare, basicModify, validateBasicModify, basicModifyDn, undoBasicModifyDn, validateBasicModifyDn, serverUrl, adminDn } from '../../testUtils';
import { clientMetaData } from '../../../src/utils/types';

describe('ldapdbs endpoint tests', () => {
  describe('new client tests', (): void => {
    describe('ldap dp url tests', () => {
      test('invalid url', async () => {
        const res = await supertest(app)
          .post('/ldapdbs/')
          .send({ ...basicNewClient, url: 'invalid url' })
          .expect(400);

        expect(res.body.type).toStrictEqual('validationError');
      });

      test('correct url', async () => {
        const res = await supertest(app)
          .post('/ldapdbs/')
          .send(basicNewClient)
          .expect(201);

        expect(res.body.id).toBeDefined();
        expect(typeof (res.body.id)).toStrictEqual('string');

        //required to not pollute server with unused client
        await supertest(app)
          .delete(`/ldapdbs/${res.body.id}`);
      });

      test('invalid body', async () => {
        const res = await supertest(app)
          .post('/ldapdbs/')
          .send({ str: 'abcdef' })
          .expect(400);

        expect(res.body.type).toStrictEqual('validationError');
      });
    });
  });

  describe('bind tests', () => {
    let clientId: string;

    beforeEach(async () => {
      const res = await supertest(app)
        .post('/ldapdbs/')
        .send(basicNewClient);

      clientId = res.body.id;
    });

    afterEach(async () => {
      await supertest(app).delete(`/ldapdbs/${clientId}`);
    });

    test('no client', async () => {
      const res = await supertest(app)
        .put(`/ldapdbs/${invalidClientId}/bind`)
        .send(adminBind)
        .expect(404);

      customErrorMessageValidator(res.body, 'cannot bind: no client exists');
    });

    test('invalid body', async () => {
      const res = await supertest(app)
        .put(`/ldapdbs/${clientId}/bind`)
        .expect(400);

      expect(res.body.type).toStrictEqual('validationError');
    });

    test('control passed', async () => {
      try {
        const res = await supertest(app)
          .put(`/ldapdbs/${clientId}/bind`)
          .send({ ...adminBind, control: testControl })
          .expect(400);

        unavailableCriticalValiadator(res.body);
      } finally {
        await supertest(app).put(`/ldapdbs/${clientId}/unbind`);
      }
    });

    test('no anon bind on error', async () => {
      await supertest(app)
        .put(`/ldapdbs/${clientId}/bind`)
        .send({ ...adminBind, control: testControl });

      const res = await supertest(app).get(`/ldapdbs/${clientId}`);

      expect(res.body.isConnected).toStrictEqual(false);
    });

    test('no boundDn update on error', async () => {
      await supertest(app)
        .put(`/ldapdbs/${clientId}/bind`)
        .send({ ...adminBind, control: testControl });

      const res = await supertest(app).get(`/ldapdbs/${clientId}`);

      expect(res.body.boundDn).toStrictEqual(null);
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
      const res = await supertest(app)
        .post('/ldapdbs/')
        .send(basicNewClient);

      clientId = res.body.id;
    });

    afterEach(async () => {
      await supertest(app).delete(`/ldapdbs/${clientId}`);
    });

    test('invalid client id', async () => {
      const res = await supertest(app)
        .put(`/ldapdbs/${invalidClientId}/unbind`)
        .expect(404);

      customErrorMessageValidator(res.body, 'cannot unbind: no client exists');
    });

    test('client already unbound', async () => {
      await supertest(app)
        .put(`/ldapdbs/${clientId}/bind`)
        .send(adminBind);

      await supertest(app).put(`/ldapdbs/${clientId}/unbind`);

      const res = await supertest(app)
        .put(`/ldapdbs/${clientId}/unbind`)
        .expect(409);

      customErrorMessageValidator(res.body, 'cannot unbind: client is not connected');
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
      const res = await supertest(app)
        .delete(`/ldapdbs/${invalidClientId}`)
        .expect(404);

      customErrorMessageValidator(res.body, 'cannot delete: no client exists');

      describe('client required tests', () => {
        let clientId: string;

        beforeEach(async () => {
          const res = await supertest(app)
            .post('/ldapdbs/')
            .send(basicNewClient);

          clientId = res.body.id;
        });

        test('client connected', async () => {
          await supertest(app)
            .put(`/ldapdbs/${clientId}/bind`)
            .send(adminBind);

          try {
            const res = await supertest(app)
              .delete(`/ldapdbs/${clientId}`)
              .expect(409);

            customErrorMessageValidator(res.body, 'cannot delete: client has active connection to database');
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
      const res = await supertest(app)
        .post(`/ldapdbs/${invalidClientId}/search`)
        .send(basicSearch)
        .expect(404);

      customErrorMessageValidator(res.body, 'cannot search: no client exists');
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
        const res = await supertest(app)
          .post(`/ldapdbs/${clients.adminClient}/search`)
          .send(basicSearch)
          .expect(409);

        customErrorMessageValidator(res.body, 'cannot search: client is not connected');
      });

      describe('bound client', () => {
        beforeEach(async () => {
          await clients.bindClients(app);
        });

        afterEach(async () => {
          await clients.unbindClients(app);
        });

        test('invalid body', async () => {
          const res = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/search`)
            .send({ client: 'abc' })
            .expect(400);

          expect(res.body.type).toStrictEqual('validationError');
        });

        test('control passed', async () => {
          const res = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/search`)
            .send({ ...basicSearch, control: testControl })
            .expect(400);

          unavailableCriticalValiadator(res.body);
        });

        test('correct search', async () => {
          const res = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/search`)
            .send(basicSearch)
            .expect(200);

          expect(res.body).toBeDefined();
          expect(res.body.searchEntries).toBeDefined();
          expect(res.body.searchEntries[0]).toBeDefined();
          expect(res.body.searchEntries[0].namingContexts).toBeDefined();
          expect(res.body.searchEntries[0].namingContexts).toStrictEqual('dc=example,dc=org');
        });
      });
    });
  });

  describe('add tests', () => {
    test('no client', async () => {
      const res = await supertest(app)
        .post(`/ldapdbs/${invalidClientId}/add`)
        .send(basicAdd)
        .expect(404);

      customErrorMessageValidator(res.body, 'cannot add: no client exists');
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
        const res = await supertest(app)
          .post(`/ldapdbs/${clients.adminClient}/add`)
          .send(basicAdd)
          .expect(409);

        customErrorMessageValidator(res.body, 'cannot add: client is not connected');

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
          const res = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/add`)
            .send({ abc: 'def' })
            .expect(400);

          expect(res.body.type).toStrictEqual('validationError');
        });

        test('control passed', async () => {
          const res = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/add`)
            .send({ ...basicAdd, control: testControl })
            .expect(400);

          unavailableCriticalValiadator(res.body);
        });

        test('correct add', async () => {
          await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/add`)
            .send(basicAdd)
            .expect(201);

          await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/del`)
            .send(basicDel);
        });
      });
    });
  });

  describe('del tests', () => {
    test('no client', async () => {
      const res = await supertest(app)
        .post(`/ldapdbs/${invalidClientId}/del`)
        .send(basicDel)
        .expect(404);

      customErrorMessageValidator(res.body, 'cannot del: no client exists');
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
        const res = await supertest(app)
          .post(`/ldapdbs/${clients.adminClient}/del`)
          .send(basicDel)
          .expect(409);

        customErrorMessageValidator(res.body, 'cannot del: client is not connected');
      });

      describe('bound client', () => {
        beforeEach(async () => {
          await clients.bindClients(app);
        });

        afterEach(async () => {
          await clients.unbindClients(app);
        });

        test('invalid body', async () => {
          const res = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/del`)
            .send({ abc: 'def' })
            .expect(400);

          expect(res.body.type).toStrictEqual('validationError');
        });

        test('correct del', async () => {
          await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/add`)
            .send(basicAdd);

          await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/del`)
            .send(basicDel)
            .expect(204);
        });

        test('control passed', async () => {
          try {
            await supertest(app)
              .post(`/ldapdbs/${clients.adminClient}/add`)
              .send(basicAdd);

            const res = await supertest(app)
              .post(`/ldapdbs/${clients.adminClient}/del`)
              .send({ ...basicDel, control: testControl })
              .expect(400);

            unavailableCriticalValiadator(res.body);
          } finally {
            await supertest(app)
              .post(`/ldapdbs/${clients.adminClient}/del`)
              .send(basicDel)
              .expect(204);
          }
        });
      });
    });
  });

  describe('exop tests', () => {
    test('no client', async () => {
      const res = await supertest(app)
        .post(`/ldapdbs/${invalidClientId}/exop`)
        .send(basicExop)
        .expect(404);

      customErrorMessageValidator(res.body, 'cannot exop: no client exists');
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
        const res = await supertest(app)
          .post(`/ldapdbs/${clients.adminClient}/exop`)
          .send(basicExop)
          .expect(409);

        customErrorMessageValidator(res.body, 'cannot exop: client is not connected');
      });

      describe('bound client', () => {
        beforeEach(async () => {
          await clients.bindClients(app);
        });

        afterEach(async () => {
          await clients.unbindClients(app);
        });

        test('correct exop', async () => {
          const res = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/exop`)
            .send(basicExop)
            .expect(200);

          expect(res.body.value).toStrictEqual(`dn:cn=admin,${baseDn}`);
        });

        test('control passed', async () => {
          const res = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/exop`)
            .send({ ...basicExop, control: testControl })
            .expect(400);

          unavailableCriticalValiadator(res.body);
        });
      });
    });
  });

  describe('compare tests', () => {
    test('no client', async () => {
      const res = await supertest(app)
        .post(`/ldapdbs/${invalidClientId}/compare`)
        .send(basicCompare)
        .expect(404);

      customErrorMessageValidator(res.body, 'cannot compare: no client exists');
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
        const res = await supertest(app)
          .post(`/ldapdbs/${clients.adminClient}/compare`)
          .send(basicCompare)
          .expect(409);

        customErrorMessageValidator(res.body, 'cannot compare: client is not connected');
      });

      describe('bound client', () => {
        beforeEach(async () => {
          await clients.bindClients(app);
        });

        afterEach(async () => {
          await clients.unbindClients(app);
        });

        test('validation error', async () => {
          const res = await supertest(app)
            .post(`/ldapdbs/${clients.adminClient}/compare`)
            .send({ abc: 'def' })
            .expect(400);

          expect(res.body.type).toStrictEqual('validationError');
        });

        describe('entry required', () => {
          beforeEach(async () => {
            await clients.addEntries(app);
          });

          afterEach(async () => {
            await clients.delEntries(app);
          });

          test('correct compare', async () => {
            const res = await supertest(app)
              .post(`/ldapdbs/${clients.adminClient}/compare`)
              .send(basicCompare)
              .expect(200);

            expect(res.body.result).toStrictEqual(true);
          });

          test('control passed', async () => {
            const res = await supertest(app)
              .post(`/ldapdbs/${clients.adminClient}/compare`)
              .send({ ...basicCompare, control: testControl })
              .expect(400);

            unavailableCriticalValiadator(res.body);
          });
        });
      });
    });
  });

  describe('modify tests', () => {
    test('no client', async () => {
      const res = await supertest(app)
        .put(`/ldapdbs/${invalidClientId}/modify`)
        .send(basicModify)
        .expect(404);

      customErrorMessageValidator(res.body, 'cannot modify: no client exists');
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
        const res = await supertest(app)
          .put(`/ldapdbs/${clients.adminClient}/modify`)
          .send(basicModify)
          .expect(409);

        customErrorMessageValidator(res.body, 'cannot modify: client is not connected');
      });

      describe('bound client', () => {
        beforeEach(async () => {
          await clients.bindClients(app);
        });

        afterEach(async () => {
          await clients.unbindClients(app);
        });

        test('validation error', async () => {
          const res = await supertest(app)
            .put(`/ldapdbs/${clients.adminClient}/modify`)
            .send({ abc: 'dev' })
            .expect(400);

          expect(res.body.type).toStrictEqual('validationError');
        });

        describe('entry required', () => {
          beforeEach(async () => {
            await clients.addEntries(app);
          });

          afterEach(async () => {
            await clients.delEntries(app);
          });

          test('correct modify', async () => {
            await supertest(app)
              .put(`/ldapdbs/${clients.adminClient}/modify`)
              .send(basicModify)
              .expect(201);

            const res = await supertest(app)
              .post(`/ldapdbs/${clients.adminClient}/compare`)
              .send(validateBasicModify)
              .expect(200);

            expect(res.body.result).toStrictEqual(true);
          });

          test('control passed', async () => {
            const res = await supertest(app)
              .put(`/ldapdbs/${clients.adminClient}/modify`)
              .send({ ...basicModify, control: testControl })
              .expect(400);

            unavailableCriticalValiadator(res.body);
          });
        });
      });
    });
  });

  describe('modify dn tests', () => {
    test('no client', async () => {
      const res = await supertest(app)
        .put(`/ldapdbs/${invalidClientId}/modifydn`)
        .send(basicModifyDn)
        .expect(404);

      customErrorMessageValidator(res.body, 'cannot modify dn: no client exists');
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
        const res = await supertest(app)
          .put(`/ldapdbs/${clients.adminClient}/modifydn`)
          .send(basicModifyDn)
          .expect(409);

        customErrorMessageValidator(res.body, 'cannot modify dn: client is not connected');
      });

      describe('bound client', () => {
        beforeEach(async () => {
          await clients.bindClients(app);
        });

        afterEach(async () => {
          await clients.unbindClients(app);
        });

        test('validation error', async () => {
          const res = await supertest(app)
            .put(`/ldapdbs/${clients.adminClient}/modifydn`)
            .send({ abc: 'def' })
            .expect(400);

          expect(res.body.type).toStrictEqual('validationError');
        });

        describe('entry required', () => {
          beforeEach(async () => {
            await clients.addEntries(app);
          });

          afterEach(async () => {
            await clients.delEntries(app);
          });

          test('correct modify dn', async () => {
            await supertest(app)
              .put(`/ldapdbs/${clients.adminClient}/modifydn`)
              .send(basicModifyDn)
              .expect(201);

            await supertest(app)
              .post(`/ldapdbs/${clients.adminClient}/search`)
              .send(validateBasicModifyDn)
              .expect(200);

            await supertest(app)
              .put(`/ldapdbs/${clients.adminClient}/modifydn`)
              .send(undoBasicModifyDn)
              .expect(201);
          });

          test('control passed', async () => {
            const res = await supertest(app)
              .put(`/ldapdbs/${clients.adminClient}/modifydn`)
              .send({ ...basicModifyDn, control: testControl })
              .expect(400);

            unavailableCriticalValiadator(res.body);
          });
        });
      });
    });
  });

  describe('client info tests', () => {
    test('no client', async () => {
      const res = await supertest(app)
        .get(`/ldapdbs/${invalidClientId}`)
        .expect(404);

      customErrorMessageValidator(res.body, 'no client exists');
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
        const res = await supertest(app)
          .get(`/ldapdbs/${clients.adminClient}`)
          .expect(200);

        const compObj: clientMetaData = {
          id: clients.adminClient,
          serverUrl: serverUrl,
          boundDn: null,
          isConnected: false
        };

        expect(res.body).toStrictEqual(compObj);
      });

      describe('bind required', () => {
        beforeEach(async () => {
          await clients.bindClients(app);
        });

        afterEach(async () => {
          await clients.unbindClients(app);
        });

        test('client connected', async () => {
          const res = await supertest(app)
            .get(`/ldapdbs/${clients.adminClient}`)
            .expect(200);

          const compObj: clientMetaData = {
            id: clients.adminClient,
            serverUrl: serverUrl,
            boundDn: adminDn,
            isConnected: true
          };

          expect(res.body).toStrictEqual(compObj);
        });

        test('unbind set boundDn to null', async () => {
          try {
            await clients.unbindClients(app);

            const res = await supertest(app)
              .get(`/ldapdbs/${clients.adminClient}`)
              .expect(200);

            const compObj: clientMetaData = {
              id: clients.adminClient,
              serverUrl: serverUrl,
              boundDn: null,
              isConnected: false
            };

            expect(res.body).toStrictEqual(compObj);
          } finally {
            await clients.bindClients(app);
          }
        });
      });
    });
  });

  describe('get ldapdbs enpoint', () => {
    test('no clients', async () => {
      const res = await supertest(app)
        .get('/ldapdbs/')
        .expect(200);

      expect(res.body).toStrictEqual([]);
    });

    describe('clients required', () => {
      const clients = new testClients;

      beforeEach(async () => {
        await clients.addClients(app);
      });

      afterEach(async () => {
        await clients.delClients(app);
      });

      test('with clients', async () => {
        const res = await supertest(app)
          .get('/ldapdbs/')
          .expect(200);

        expect(res.body.length).toStrictEqual(2);
      });
    });
  });
});
