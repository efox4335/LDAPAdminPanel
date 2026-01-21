import { type Page, type Locator } from '@playwright/test';

const locateTableByHeaderText = (page: Page, startingLocation: Locator, headerText: string | RegExp) => {
  return startingLocation
    .locator('thead')
    .filter({
      has: page
        .locator('th')
        .filter({
          has: page
            .getByText(headerText)
        })
    })
    .locator('..');
};

export default locateTableByHeaderText;
