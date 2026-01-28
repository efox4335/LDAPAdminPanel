import { type Page, type Locator, expect } from '@playwright/test';

const locateNewControl = async (page: Page, controlTable: Locator, controlOid: string) => {
  let curChild = 0;

  const controlRows = controlTable.getByRole('row');

  for (const singleControlRow of await controlRows.all()) {
    try {
      await expect(singleControlRow.getByRole('textbox')).toHaveValue(RegExp(`^${controlOid}$`), { timeout: 100 });

      return controlRows.nth(curChild);
    } catch { /* only one expect has to not error */ } finally { curChild += 1; }
  }

  throw new Error(`no control for oid ${controlOid} found`);
};

export default locateNewControl;
