import { ZodError } from 'zod';

interface controlObject {
  type: string,
  critical: boolean
};

export type modifyReqChange = {
  operation: 'replace' | 'add' | 'delete',
  type: string,
  values: string[]
};

export interface control {
  control?: controlObject | controlObject[] | undefined
};

export interface bindReq extends control {
  dnOrSaslMechanism: string,
  password?: string | undefined,
};

export type clientReq = {
  url: string
};

export interface searchReq extends control {
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

export interface addReq extends control {
  baseDn: string,
  entry: Record<string, string[] | string>
};

export interface delReq extends control {
  dn: string
};

export interface exopReq extends control {
  oid: string,
  value?: string | undefined
};

export interface compareReq extends control {
  dn: string,
  attribute: string,
  value: string
};

export interface modifyDnReq extends control {
  dn: string,
  newDN: string
};

export interface modifyReq extends control {
  dn: string,
  changes: modifyReqChange[]
};

export type clientMetaData = {
  isConnected: boolean
};

type ldapError = {
  type: 'ldapError',
  code: number,
  name: string
};

type validationError = {
  type: 'validationError',
  error: ZodError
};

type customErrorMessage = {
  type: 'customErrorMessage',
  message: string
};

export type responseError = ldapError | validationError | customErrorMessage;
