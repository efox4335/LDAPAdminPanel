export type bindReq = {
  dnOrSaslMechanism: string,
  password?: string | undefined
};

export type clientReq = {
  url: string
};

export type searchReq = {
  baseDn: string,
  options: {
    scope: 'base' | 'one' | 'sub' | 'children',
    filter: string,
    derefAliases: 'never' | 'always' | 'search' | 'find',
    sizeLimit: number,
    timeLimit: number,
    paged: boolean,
    attributes: string[]
  }
};

export type addReq = {
  baseDn: string,
  entry: Record<string, string[] | string>
};
