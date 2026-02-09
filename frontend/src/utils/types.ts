export type newClientResponse = {
  id: string
};

export interface controlObject {
  type: string,
  critical: boolean
};

export interface newControlObject extends controlObject {
  id: string
};

interface controlReq {
  control?: controlObject[] | undefined
};

export interface bindReq extends controlReq {
  dnOrSaslMechanism: string,
  password?: string | undefined,
};

export interface addReq extends controlReq {
  baseDn: string,
  entry: Omit<ldapEntry, 'dn'>
};

export interface delReq extends controlReq {
  dn: string
};

export interface modifyReq extends controlReq {
  dn: string,
  changes: modifyReqChange[]
};

export interface modifyDnReq extends controlReq {
  dn: string,
  newDN: string
};

export interface exopReq extends controlReq {
  oid: string,
  value?: string | undefined
};

export type searchScope = 'base' | 'one' | 'sub' | 'children';

export type searchDerefAliases = 'never' | 'always' | 'search' | 'find';

export interface searchReq extends controlReq {
  baseDn: string,
  options: {
    scope: searchScope,
    filter: string,
    derefAliases: searchDerefAliases,
    sizeLimit: number,
    timeLimit: number,
    paged: boolean,
    attributes: string[]
  }
};

export type exopRes = {
  oid?: string,
  value?: string
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

export type operationalLdapEntry = Record<string, string | string[]>;

export type modifyReqChange = {
  operation: 'replace' | 'add' | 'delete',
  type: string,
  values: string[]
};

export type searchRes = {
  searchEntries: Record<string, string | string[]>[],
  searchReferences: string[]
};

export type ldapAttribute = {
  name: string,
  values: string | string[]
};

interface baseServerTreeEntry {
  dn: string
  children: Record<string, string>
};

interface visibleServerTreeEntry extends baseServerTreeEntry {
  visible: true,
  entry: ldapEntry,
  operationalEntry: operationalLdapEntry,
  isExpanded: boolean
};

interface hiddenServerTreeEntry extends baseServerTreeEntry {
  visible: false
};

export type openLdapEntry =
  {
    entryType: 'newEntry',
    id: string,
    initialAttributes: Record<string, string[]>
  } |
  {
    entryType: 'existingEntry'
    entryDn: string
  };

export type serverTreeEntry = visibleServerTreeEntry | hiddenServerTreeEntry;

export type client = {
  id: string,
  serverUrl: string,
  boundDn: string | null,
  isConnected: boolean,
  openEntries: openLdapEntry[],
  openEntryMap: Record<string, string>,
  entryMap: Record<string, serverTreeEntry> | undefined
};

export type clientStore = Record<string, client>;

export type newLdapAttributeValue = {
  id: string,
  value: string
};

export type newLdapAttribute = {
  id: string,
  attributeName: string,
  values: newLdapAttributeValue[]
};

export type queryFetchRes = {
  visibleEntry: ldapEntry,
  operationalEntry: operationalLdapEntry
};

type settingPrimitiveValue = string | null | number | boolean;

export type settingValue = settingPrimitiveValue | settingPrimitiveValue[];

export interface settingPath {
  path: string[]
}

export interface truncateSetting extends settingPath {
  value: settingValue
}

export type delSettingsReq = {
  settings: settingPath[]
};

export type truncateSettingsReq = {
  settings: truncateSetting[]
};

export type getAllSettingsRes = {
  settings: Record<string, unknown>,
  defaults: Record<string, unknown>
};

export type truncateSettingsRes = {
  settings: Record<string, unknown>
};

export type settingsStore = {
  isSettingsPanelOpen: boolean,
  defaults: Record<string, unknown>,
  settings: Record<string, unknown>
};
