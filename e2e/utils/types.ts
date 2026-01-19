export type entryAttribute = {
  name: string,
  values: string[]
};

export type ldapEntry = {
  dn: string,
  attributes: entryAttribute[]
};

export type ldapControl = {
  oid: string,
  critical: boolean
};
