export type newClientResponse = {
  id: string
};

export type bindReq = {
  dnOrSaslMechanism: string,
  password?: string | undefined,
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

type ldapError = {
  type: 'ldapError',
  code: number,
  name: string
};

type validationError = {
  type: 'validationError',
  error: string
};

type customErrorMessage = {
  type: 'customErrorMessage',
  message: string
};

export type rawError = ldapError | validationError | customErrorMessage;

export type displayError = {
  id: string,
  message: string,
  rawError: string
};

interface ldapEntryReqAttributes {
  dn: string,
  objectClass: string | string[],
};

export type ldapEntry = ldapEntryReqAttributes &
  Record<string, string | string[]>;

export type searchRes = {
  searchEntries: ldapEntry[],
  searchReferences: string[]
};

interface baseServerTreeEntry {
  dn: string
  children: Record<string, string>
};

interface visibleServerTreeEntry extends baseServerTreeEntry {
  visible: true,
  entry: ldapEntry
};

interface hiddenServerTreeEntry extends baseServerTreeEntry {
  visible: false
};

export type serverTreeEntry = visibleServerTreeEntry | hiddenServerTreeEntry;

export type client = {
  id: string,
  serverUrl: string,
  boundDn: string | null,
  isConnected: boolean,
  entryMap: Record<string, serverTreeEntry> | undefined
};

export type clientStore = Record<string, client>;
