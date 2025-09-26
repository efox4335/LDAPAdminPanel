import axios, { type AxiosResponse } from 'axios';

import type { client } from '../utils/types';

const baseUrl = '/ldapdbs/';

export const getAllClients = async () => {
  const res: AxiosResponse<client[]> = await axios.get(baseUrl);

  return res.data;
};
