import axios, { type AxiosResponse } from 'axios';

import type { truncateSettingsReq, delSettingsReq, getAllSettingsRes, truncateSettingsRes } from '../utils/types';

const baseUrl = '/settings/';

export const getSettings = async (): Promise<getAllSettingsRes> => {
  const res: AxiosResponse<getAllSettingsRes> = await axios.get(baseUrl);

  return res.data;
};

export const delSettings = async (req: delSettingsReq) => {
  await axios.post(`${baseUrl}del`, req);
};

export const truncateSettings = async (req: truncateSettingsReq): Promise<truncateSettingsRes> => {
  const res: AxiosResponse<truncateSettingsRes> = await axios.post(`${baseUrl}truncate`, req);

  return res.data;
};
