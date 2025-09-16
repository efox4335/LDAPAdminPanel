export type bindReq = {
  clientId: number,
  dnOrSaslMechanism: string,
  password?: string | undefined
};

export type clientReq = {
  url: string
};
