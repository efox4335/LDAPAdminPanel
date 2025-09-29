import axios, { type AxiosResponse } from 'axios';

import type { bindReq, client, newClientResponse } from '../utils/types';

const baseUrl = '/ldapdbs/';

export const getAllClients = async () => {
  const res: AxiosResponse<client[]> = await axios.get(baseUrl);

  return res.data;
};

export const addNewClient = async (serverUrl: string) => {
  const res: AxiosResponse<newClientResponse> = await axios.post(baseUrl, { url: serverUrl });

  return res.data;
};

export const deleteClient = async (id: string) => {
  await axios.delete(`${baseUrl}${id}`);
};

export const bindClient = async (id: string, req: bindReq) => {
  await axios.put(`${baseUrl}${id}/bind`, req);
};
