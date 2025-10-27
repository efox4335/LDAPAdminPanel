import axios, { type AxiosResponse } from 'axios';

import type { addReq, bindReq, client, delReq, exopReq, exopRes, modifyDnReq, modifyReq, newClientResponse, searchReq, searchRes } from '../utils/types';

const baseUrl = '/ldapdbs/';

export const getAllClients = async (): Promise<client[]> => {
  const res: AxiosResponse<client[]> = await axios.get(baseUrl);

  return res.data;
};

export const addNewClient = async (serverUrl: string): Promise<newClientResponse> => {
  const res: AxiosResponse<newClientResponse> = await axios.post(baseUrl, { url: serverUrl });

  return res.data;
};

export const deleteClient = async (clientId: string) => {
  await axios.delete(`${baseUrl}${clientId}`);
};

export const bindClient = async (clientId: string, req: bindReq) => {
  await axios.put(`${baseUrl}${clientId}/bind`, req);
};

export const unbindClient = async (clientId: string) => {
  await axios.put(`${baseUrl}${clientId}/unbind`);
};

export const searchClient = async (clientId: string, req: searchReq): Promise<searchRes> => {
  const res: AxiosResponse<searchRes> = await axios.post(`${baseUrl}${clientId}/search`, req);

  return res.data;
};

export const deleteEntry = async (clientId: string, req: delReq) => {
  await axios.post(`${baseUrl}${clientId}/del`, req);
};

export const modifyEntry = async (clientId: string, req: modifyReq) => {
  await axios.put(`${baseUrl}${clientId}/modify`, req);
};

export const addNewEntry = async (clientId: string, req: addReq) => {
  await axios.post(`${baseUrl}${clientId}/add`, req);
};

export const modifyEntryDn = async (clientId: string, req: modifyDnReq) => {
  await axios.put(`${baseUrl}${clientId}/modifydn`, req);
};

export const exopClient = async (clientId: string, req: exopReq): Promise<exopRes> => {
  const res: AxiosResponse<exopRes> = await axios.post(`${baseUrl}${clientId}/exop`, req);

  return res.data;
};
