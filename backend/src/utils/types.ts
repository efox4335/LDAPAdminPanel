import { ZodError } from 'zod';

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

export type delReq = {
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
