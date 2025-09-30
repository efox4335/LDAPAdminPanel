export type client = {
  id: string,
  serverUrl: string,
  boundDn: string | null,
  isConnected: boolean
};

export type clientStore = Record<string, client>;

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

type zodError = {
  error: {
    issues: [
      {
        code: string,
        path: (string | number)[],
        message: string
      }
    ]
  }
};

type ldapError = {
  type: 'ldapError',
  code: number,
  name: string
};

type validationError = {
  type: 'validationError',
  error: zodError | string
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

interface baseServerTreeEntry<T> {
  dn: string
  children: T[]
};

interface visibleServerTreeEntry<T> extends baseServerTreeEntry<T> {
  visible: true,
  entry: ldapEntry
};

interface hiddenServerTreeEntry<T> extends baseServerTreeEntry<T> {
  visible: false
};

/*
 * no parent links because immer does not like circular references
 * can't be a class because classes shouldn't be stored in redux store
*/
export type serverTreeEntry = visibleServerTreeEntry<serverTreeEntry> | hiddenServerTreeEntry<serverTreeEntry>;
