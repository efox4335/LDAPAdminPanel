export type client = {
  id: string,
  serverUrl: string,
  boundDn: string | null,
  isConnected: boolean
};

export type clientStore = Record<string, client>;
