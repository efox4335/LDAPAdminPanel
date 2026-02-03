import { readFile } from 'node:fs/promises';

const getDefaultSettings = async (defaultSettingsFile: string): Promise<Record<string, unknown>> => {
  try {
    const defaultSettingsString = await readFile(defaultSettingsFile, { encoding: 'utf-8' });

    return JSON.parse(defaultSettingsString) as Record<string, unknown>;
  } catch {
    return {};
  }
};

export default getDefaultSettings;
