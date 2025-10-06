import axios, { type AxiosResponse } from 'axios';

import type { addReq, bindReq, client, delReq, modifyReq, newClientResponse, searchReq, searchRes } from '../utils/types';

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

export const unbindClient = async (id: string) => {
  await axios.put(`${baseUrl}${id}/unbind`);
};

export const searchClient = async (id: string, req: searchReq) => {
  const res: AxiosResponse<searchRes> = await axios.post(`${baseUrl}${id}/search`, req);

  return res.data;
};

export const deleteEntry = async (id: string, req: delReq) => {
  await axios.post(`${baseUrl}${id}/del`, req);
};

export const modifyEntry = async (id: string, req: modifyReq) => {
  await axios.put(`${baseUrl}${id}/modify`, req);
};

export const addNewEntry = async (id: string, req: addReq) => {
  await axios.post(`${baseUrl}${id}/add`, req);
};
