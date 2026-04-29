import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { serverInfo } from './types';

const assertServerInfo = async (page: Page, assertedServerInfo: serverInfo) => {
  const serverInfoDisplay = page.getByText('server info').locator('..');

  await expect(serverInfoDisplay).toHaveText(assertedServerInfo.isConnected ? /.*connected.*/ : /.*not connected.*/);

  await expect(
    serverInfoDisplay
      .getByText('bound dn')
      .locator('..')
      .getByRole('cell')
      .nth(1)
  ).toHaveText(RegExp(`.*${assertedServerInfo.boundDn}.*`));

  await expect(
    serverInfoDisplay
      .getByText('server url')
      .locator('..')
      .getByRole('cell')
      .nth(1)
  ).toHaveText(RegExp(`.*${assertedServerInfo.ldapServerUrl}.*`));

  await expect(
    serverInfoDisplay
      .getByText('tls enabled')
      .locator('..')
      .getByRole('cell')
      .nth(1)
  ).toHaveText(RegExp(`.*${assertedServerInfo.tlsEnabled}.*`));
};

export default assertServerInfo;
