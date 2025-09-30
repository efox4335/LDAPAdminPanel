import { AxiosError } from 'axios';
import type { rawError } from './types';

const generateErrorMessage = (err: unknown): string => {
  if (!(typeof (err) === 'object')) {
    return 'unrecognized error';
  }

  if (err instanceof Error) {
    return err.message;
  }

  let validError;

  if (err instanceof AxiosError) {
    validError = err.response?.data as rawError;
  } else {
    validError = err as rawError;
  }

  switch (validError.type) {
    case 'ldapError':
      return `code: ${validError.code} name: ${validError.name}`;
    case 'customErrorMessage':
      return validError.message;
    case 'validationError':
      if (typeof (validError.error) === 'string') {
        return validError.error;
      }

      return validError.error.error.issues.reduce((str, val) => {
        const path = (val.path.length > 0) ? val.path[0] : '';

        return `${str}field ${path} ${val.message} `;
      }, '');

    default:
      return 'unrecognized error';
  }
};

export default generateErrorMessage;
