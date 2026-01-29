import { type Locator } from '@playwright/test';

const expandAdvancedOptions = async (searchForm: Locator) => {
  await searchForm
    .getByRole('button', { name: /\u{23F5}.*/u })
    .click({ timeout: 100 });
};

export default expandAdvancedOptions;
