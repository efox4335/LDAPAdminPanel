import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { clientInfo } from './types';

const assertClientInfo = async (page: Page, assertedClientInfo: clientInfo) => {
  const clientInfoDisplay = page.getByText('client info').locator('..');

  await expect(clientInfoDisplay).toHaveText(assertedClientInfo.isConnected ? /.*connected.*/ : /.*not connected.*/);

  await expect(
    clientInfoDisplay
      .getByText('bound dn')
      .locator('..')
      .getByRole('cell')
      .nth(1)
  ).toHaveText(RegExp(`.*${assertedClientInfo.boundDn}.*`));

  await expect(
    clientInfoDisplay
      .getByText('server url')
      .locator('..')
      .getByRole('cell')
      .nth(1)
  ).toHaveText(RegExp(`.*${assertedClientInfo.ldapServerUrl}.*`));

  await expect(
    clientInfoDisplay
      .getByText('tls enabled')
      .locator('..')
      .getByRole('cell')
      .nth(1)
  ).toHaveText(RegExp(`.*${assertedClientInfo.tlsEnabled}.*`));
};

export default assertClientInfo;
