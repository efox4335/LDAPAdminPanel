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

type zodError = {
  error: {
    issues: [
      {
        code: string,
        path: [
          string | number
        ],
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
