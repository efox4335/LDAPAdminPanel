import axios, { type AxiosResponse } from 'axios';

import type {
  addReq,
  bindReq,
  server,
  delReq,
  exopReq,
  exopRes,
  modifyDnReq,
  modifyReq,
  newServerResponse,
  newServerReq,
  searchReq,
  searchRes
} from '../utils/types';

const baseUrl = '/ldapdbs/';

export const getAllServers = async (): Promise<server[]> => {
  const res: AxiosResponse<server[]> = await axios.get(baseUrl);

  return res.data;
};

export const addNewServer = async (req: newServerReq): Promise<newServerResponse> => {
  const res: AxiosResponse<newServerResponse> = await axios.post(baseUrl, req);

  return res.data;
};

export const deleteServer = async (serverId: string) => {
  await axios.delete(`${baseUrl}${serverId}`);
};

export const bindServer = async (serverId: string, req: bindReq) => {
  await axios.put(`${baseUrl}${serverId}/bind`, req);
};

export const unbindServer = async (serverId: string) => {
  await axios.put(`${baseUrl}${serverId}/unbind`);
};

export const searchServer = async (serverId: string, req: searchReq): Promise<searchRes> => {
  const res: AxiosResponse<searchRes> = await axios.post(`${baseUrl}${serverId}/search`, req);

  return res.data;
};

export const deleteEntry = async (serverId: string, req: delReq) => {
  await axios.post(`${baseUrl}${serverId}/del`, req);
};

export const modifyEntry = async (serverId: string, req: modifyReq) => {
  await axios.put(`${baseUrl}${serverId}/modify`, req);
};

export const addNewEntry = async (serverId: string, req: addReq) => {
  await axios.post(`${baseUrl}${serverId}/add`, req);
};

export const modifyEntryDn = async (serverId: string, req: modifyDnReq) => {
  await axios.put(`${baseUrl}${serverId}/modifydn`, req);
};

export const exopServer = async (serverId: string, req: exopReq): Promise<exopRes> => {
  const res: AxiosResponse<exopRes> = await axios.post(`${baseUrl}${serverId}/exop`, req);

  return res.data;
};
