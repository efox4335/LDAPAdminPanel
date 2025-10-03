import { AxiosError } from 'axios';
import type { rawError } from './types';

const generateErrorMessage = (err: unknown): string => {
  let validError: unknown;

  if (err instanceof AxiosError && err.response && err.response.data) {
    validError = err.response.data;
  } else if (err instanceof Error) {
    return err.message;
  } else {
    validError = err;
  }

  if (!(typeof (validError) === 'object') || validError === null || validError === undefined) {
    return 'unrecognized error';
  }

  if (!('type' in validError) || typeof (validError.type) !== 'string') {
    if (!('message' in validError)) {
      return 'unrecognized error';
    }

    if (typeof (validError.message) !== 'string') {
      return 'unrecognized error';
    }
    return validError.message;
  }

  const rawError = validError as rawError;

  switch (rawError.type) {
    case 'ldapError':
      return `code: ${rawError.code} name: ${rawError.name}`;
    case 'customErrorMessage':
      return rawError.message;
    case 'validationError':
      if (typeof (rawError.error) === 'string') {
        return rawError.error;
      }

      return rawError.error.error.issues.reduce((str, val) => {
        const path = (val.path.length > 0) ? val.path[0] : '';

        return `${str}field ${path} ${val.message} `;
      }, '');

    default:
      return 'unrecognized error';
  }
};

export default generateErrorMessage;
