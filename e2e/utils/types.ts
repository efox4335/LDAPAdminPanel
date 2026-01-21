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
