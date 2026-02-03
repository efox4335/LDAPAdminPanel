/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import test, { beforeEach, describe } from 'node:test';
import { writeFile, unlink, readFile } from 'node:fs/promises';
import supertest from 'supertest';
import expect from 'expect';

import app from '../../../src/app';
import { settingsFile, defaultSettings } from '../../../src/utils/state';

describe('settings enpoint tests', () => {
  beforeEach(async () => {
    await writeFile(settingsFile, '');
  });

  describe('get all settings endpoint', () => {
    test('default test file returned', async () => {
      const res = await supertest(app)
        .get('/settings')
        .expect(200);

      expect(JSON.stringify(res.body.settings)).toStrictEqual(JSON.stringify(defaultSettings));
      expect(JSON.stringify(res.body.defaults)).toStrictEqual(JSON.stringify(defaultSettings));
    });

    test('if no test file is present one will be created with default settings', async () => {
      await unlink(settingsFile);

      const res = await supertest(app)
        .get('/settings')
        .expect(200);

      expect(JSON.stringify(res.body.settings)).toStrictEqual(JSON.stringify(defaultSettings));
      expect(JSON.stringify(res.body.defaults)).toStrictEqual(JSON.stringify(defaultSettings));

      const newSettings = await readFile(settingsFile, 'utf-8');

      expect(defaultSettings).toStrictEqual(JSON.parse(newSettings));
    });
  });

  describe('truncate settings enpoint', () => {
    test('long path setting works', async () => {
      const res = await supertest(app)
        .post('/settings/truncate')
        .send({ settings: [{ path: ['testPath', 'testSetting'], value: 'abc' }] })
        .expect(201);

      expect(res.body.settings.testPath.testSetting).toStrictEqual('abc');
    });

    test('truncating a setting works', async () => {
      const res = await supertest(app)
        .post('/settings/truncate')
        .send({ settings: [{ path: ['testSetting'], value: 'abc' }] })
        .expect(201);

      expect(res.body.settings.testSetting).toStrictEqual('abc');
    });

    test('if no test file is present one will be created with default settings', async () => {
      await unlink(settingsFile);

      const res = await supertest(app)
        .post('/settings/truncate')
        .send({ settings: [] })
        .expect(201);

      expect(JSON.stringify(res.body.settings)).toStrictEqual(JSON.stringify(defaultSettings));

      const newSettings = await readFile(settingsFile, 'utf-8');

      expect(defaultSettings).toStrictEqual(JSON.parse(newSettings));
    });
  });

  describe('delete settings enpoint', () => {
    test('deleting a setting works', async () => {
      await supertest(app)
        .post('/settings/truncate')
        .send({ settings: [{ path: ['testSetting'], value: 'abc' }] })
        .expect(201);

      await supertest(app)
        .post('/settings/del')
        .send({ settings: [{ path: ['testSetting'] }] })
        .expect(204);

      const res = await supertest(app)
        .get('/settings')
        .expect(200);

      expect(JSON.stringify(res.body.settings)).toStrictEqual(JSON.stringify(defaultSettings));
      expect(JSON.stringify(res.body.defaults)).toStrictEqual(JSON.stringify(defaultSettings));
    });

    test('long path delete', async () => {
      await supertest(app)
        .post('/settings/truncate')
        .send({ settings: [{ path: ['testPath', 'testSetting'], value: 'abc' }] })
        .expect(201);

      await supertest(app)
        .post('/settings/del')
        .send({ settings: [{ path: ['testPath', 'testSetting'] }] })
        .expect(204);

      const res = await supertest(app)
        .get('/settings')
        .expect(200);

      expect(res.body.settings.testPath).toStrictEqual({});
    });

    test('deleting parent before child works', async () => {
      await supertest(app)
        .post('/settings/truncate')
        .send({ settings: [{ path: ['testPath', 'testSetting'], value: 'abc' }] })
        .expect(201);

      await supertest(app)
        .post('/settings/del')
        .send({ settings: [{ path: ['testPath'] }, { path: ['testPath', 'testSetting'] }] })
        .expect(204);

      const res = await supertest(app)
        .get('/settings')
        .expect(200);

      expect(JSON.stringify(res.body.settings)).toStrictEqual(JSON.stringify(defaultSettings));
      expect(JSON.stringify(res.body.defaults)).toStrictEqual(JSON.stringify(defaultSettings));
    });

    test('if no test file is present one will be created with default settings', async () => {
      await unlink(settingsFile);

      await supertest(app)
        .post('/settings/del')
        .send({ settings: [] })
        .expect(204);

      const newSettings = await readFile(settingsFile, 'utf-8');

      expect(defaultSettings).toStrictEqual(JSON.parse(newSettings));
    });
  });
});
