import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const assertClientInfo = async (page: Page, isConnected: boolean, boundDn: string, ldapServerUrl: string) => {
  const clientInfo = page.getByText('client info').locator('..');

  await expect(clientInfo).toHaveText(isConnected ? /.*connected.*/ : /.*not connected.*/);

  await expect(
    clientInfo
      .getByText('bound dn')
      .locator('..')
      .getByRole('cell')
      .nth(1)
  ).toHaveText(RegExp(`.*${boundDn}.*`));

  await expect(
    clientInfo
      .getByText('server url')
      .locator('..')
      .getByRole('cell')
      .nth(1)
  ).toHaveText(RegExp(`.*${ldapServerUrl}.*`));
};

export default assertClientInfo;
