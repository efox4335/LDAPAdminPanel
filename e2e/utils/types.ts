export type entryAttribute = {
  name: string,
  values: string[]
};

type deleteAttribute = {
  type: 'deleteAttribute',
  name: string
};

type truncateAttribute = {
  type: 'truncate',
  attribute: entryAttribute,
};

type appendAttribute = {
  type: 'append',
  attribute: entryAttribute
};

type deleteValues = {
  type: 'deleteValues',
  attribute: entryAttribute
};

type addAttribute = {
  type: 'add',
  attribute: entryAttribute
};

export type modification =
  deleteAttribute |
  truncateAttribute |
  appendAttribute |
  addAttribute |
  deleteValues;

export type modifyEntry = {
  dn: string,
  modifications: modification[]
};

export type ldapEntry = {
  dn: string,
  attributes: entryAttribute[]
};

export type ldapControl = {
  oid: string,
  critical: boolean
};

export type searchScope = 'base' | 'one' | 'sub' | 'children';

export type searchDerefAliases = 'never' | 'always' | 'search' | 'find';

export type ldapSearch = {
  name?: string,
  filter?: string,
  baseDns?: string[],
  timeLimit?: string,
  maxEntries?: string,
  scope?: searchScope,
  aliasDeref?: searchDerefAliases,
};

export type serverInfo = {
  ldapServerUrl: string,
  boundDn: string,
  isConnected: boolean,
  tlsEnabled: boolean
};

export type changeSetting = {
  setting: 'enableLogging',
  newValue: boolean
} | {
  setting: 'logFile',
  newValue: string
} | {
  setting: 'forceTls',
  newValue: boolean
} | {
  setting: 'customCertificates',
  removeExistingCerts: boolean,
  addNewCert: boolean,
  relativeFilePath: string
};

export type objectClassType = 'ABSTRACT' | 'STRUCTURAL' | 'AUXILIARY' | 'INPARENT';

export type objectClassSchema = {
  oid?: string,
  names?: string[],
  description?: string,
  obsolete?: boolean,
  supObjectClasses?: string[],
  type?: objectClassType,
  reqAttributes?: string[],
  optAttributes?: string[]
};
