export type entryAttribute = {
  name: string,
  values: string[]
};

export type ldapEntry = {
  dn: string,
  attributes: entryAttribute[]
};
