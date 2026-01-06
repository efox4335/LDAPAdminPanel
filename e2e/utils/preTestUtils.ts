import type { Page } from '@playwright/test'

import { pageUrl, ldapServerUrl } from './constants';

export const addServer = async (page: Page) => {
  await page.goto(pageUrl);

  await page.getByRole('textbox').fill(ldapServerUrl);

  await page.getByRole('button', { name: 'add' }).click();
}

export const removeServer = async (page: Page) => {
  await page.getByRole('button', { name: 'remove' }).click();
}
