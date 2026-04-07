import type { Page } from '@playwright/test';

import { pageUrl, ldapServerUrl, adminDn, adminPassword, tlsServerUrl, configAdminDn } from './constants';

export const navToPage = async (page: Page) => {
  await page.goto(pageUrl);
};

export const addServer = async (page: Page) => {
  await page.getByRole('textbox').fill(ldapServerUrl);

  await page.getByRole('button', { name: 'add' }).click();
};

export const addTlsServer = async (page: Page) => {
  await page.getByRole('textbox').fill(tlsServerUrl);

  await page.getByRole('checkbox').check();

  await page.getByRole('button', { name: 'add' }).click();
};

export const removeServer = async (page: Page) => {
  await page.getByRole('button', { name: 'remove' }).click();
};

export const adminBind = async (page: Page) => {
  await page
    .locator('.singleClientBind')
    .getByText('dn')
    .locator('..')
    .getByRole('textbox')
    .fill(adminDn);

  await page
    .locator('.singleClientBind')
    .getByText('password')
    .locator('..')
    .getByRole('textbox')
    .fill(adminPassword);

  await page
    .locator('.singleClientBind')
    .getByRole('button', { name: 'bind' })
    .click();
};

export const configAdminBind = async (page: Page) => {
  await page
    .locator('.singleClientBind')
    .getByText('dn')
    .locator('..')
    .getByRole('textbox')
    .fill(configAdminDn);

  await page
    .locator('.singleClientBind')
    .getByText('password')
    .locator('..')
    .getByRole('textbox')
    .fill(adminPassword);

  await page
    .locator('.singleClientBind')
    .getByRole('button', { name: 'bind' })
    .click();
};

export const unbind = async (page: Page) => {
  await page.getByRole('button', { name: 'unbind' }).click();
};
