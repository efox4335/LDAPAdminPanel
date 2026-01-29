import { type Locator, expect } from '@playwright/test';

const assertAdvancedOptionsClosed = async (curLoc: Locator) => {
  await expect(curLoc.getByText(/\u{23F5}.*/u)).toBeVisible();
};

export default assertAdvancedOptionsClosed;
