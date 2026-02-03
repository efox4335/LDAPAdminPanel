import express from 'express';
import { writeFile } from 'node:fs/promises';
import asyncLock from 'async-lock';

import { settingsFile, defaultSettings } from '../utils/state';
import { delSettingsReqSchema, truncateSettingsReqSchema } from '../utils/schemas';
import type { delSettingsReq, truncateSettingsReq } from '../utils/types';
import getCurSettings from '../utils/getCurSettings';

const router = express.Router();

const settingsLock = new asyncLock();

router.get('/', async (_req, res, next) => {
  try {
    await settingsLock.acquire('settingsLock', async () => {
      const curSettings = await getCurSettings();

      res.status(200).send({ settings: curSettings, defaults: defaultSettings });
    });
  } catch (err) {
    next(err);
  }
});

router.post('/truncate', async (req, res, next) => {
  try {
    await settingsLock.acquire('settingsLock', async () => {
      const curSettings = await getCurSettings();

      let settingObject: Record<string, unknown>;

      if (typeof (curSettings) !== 'object' || curSettings === null) {
        settingObject = {};
      } else {
        settingObject = curSettings;
      }

      const parsedReq: truncateSettingsReq = truncateSettingsReqSchema.parse(req.body);

      for (const truncateSetting of parsedReq.settings) {
        let truncateSettingParent: Record<string, unknown> = settingObject;

        const lastPathIndex = truncateSetting.path.length - 1;

        let curIndex = 0;

        for (const path of truncateSetting.path) {
          if (curIndex === lastPathIndex) {
            break;
          }

          if (typeof (truncateSettingParent) !== 'object' || truncateSettingParent === null) {
            break;
          }

          const curSetting: unknown = truncateSettingParent[path];

          if (typeof (curSetting) !== 'object' || curSetting === null) {
            truncateSettingParent[path] = {};

            truncateSettingParent = truncateSettingParent[path] as Record<string, unknown>;
          } else {
            truncateSettingParent = curSetting as Record<string, unknown>;
          }

          ++curIndex;
        }

        const lastPath = truncateSetting.path[lastPathIndex];

        if (lastPath === undefined) {
          continue;
        }

        truncateSettingParent[lastPath] = truncateSetting.value;
      }

      await writeFile(settingsFile, JSON.stringify(settingObject, null, ' '));

      res.status(201).send({ settings: settingObject });
    });
  } catch (err) {
    next(err);
  }
});

router.post('/del', async (req, res, next) => {
  try {
    await settingsLock.acquire('settingsLock', async () => {
      const curSettings = await getCurSettings();

      let settingObject: Record<string, unknown>;

      if (typeof (curSettings) !== 'object' || curSettings === null) {
        settingObject = {};
      } else {
        settingObject = curSettings;
      }

      const parsedReq: delSettingsReq = delSettingsReqSchema.parse(req.body);

      for (const delSettingPath of parsedReq.settings) {
        let delSettingParent: Record<string, unknown> = settingObject;

        const lastPathIndex = delSettingPath.path.length - 1;

        let curIndex = 0;

        for (const path of delSettingPath.path) {
          if (curIndex === lastPathIndex) {
            break;
          }

          if (typeof (delSettingParent) !== 'object' || delSettingParent === null) {
            break;
          }

          const curSetting: unknown = delSettingParent[path];

          if (typeof (curSetting) !== 'object' || curSetting === null) {
            break;
          }

          delSettingParent = curSetting as Record<string, unknown>;

          ++curIndex;
        }

        const lastPath = delSettingPath.path[lastPathIndex];

        if (lastPath === undefined) {
          continue;
        }

        // no error if not found because deleting parent and child should be valid even if parent comes before child
        if (curIndex === lastPathIndex) {
          delete delSettingParent[lastPath];
        }
      }

      await writeFile(settingsFile, JSON.stringify(settingObject, null, ' '));

      res.status(204).end();
    });
  } catch (err) {
    next(err);
  }
});

export default router;
