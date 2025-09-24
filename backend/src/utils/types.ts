import { ZodError } from 'zod';

interface controlObject {
  type: string,
  critical: boolean
};

interface control {
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

export type clientMetaData = {
  isConnected: boolean
};

type ldapError = {
  type: 'ldapError',
  code: number,
  name: string
};

type zodError = {
  type: 'zodError',
  error: ZodError
};

type customErrorMessage = {
  type: 'customErrorMessage',
  message: string
};

export type responseError = ldapError | zodError | customErrorMessage;
