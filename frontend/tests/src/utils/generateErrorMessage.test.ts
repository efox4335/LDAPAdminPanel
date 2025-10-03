import { AxiosError, AxiosHeaders } from 'axios';
import { describe, test, expect } from 'vitest';

import generateErrorMessage from '../../../src/utils/generateErrorMessage';
import type { rawError } from '../../../src/utils/types';

describe('generateErrorMessage.ts tests', () => {
  test('axios error with response', () => {
    const request = { path: '/foo' };
    const headers = new AxiosHeaders();
    const config = {
      url: 'http://localhost:3000',
      headers
    };
    const error = new AxiosError('error message', '123', config, request, {
      status: 200,
      data: { message: 'response error' },
      statusText: 'ok',
      config,
      headers
    });

    const errMessage = generateErrorMessage(error);

    expect(errMessage).toStrictEqual('response error');
  });

  test('axios error without response', () => {
    const request = { path: '/foo' };
    const headers = new AxiosHeaders();
    const config = {
      url: 'http://localhost:3000',
      headers
    };
    const error = new AxiosError('error message', '123', config, request);

    const errMessage = generateErrorMessage(error);

    expect(errMessage).toStrictEqual('error message');
  });

  test('error object', () => {
    const error = new Error('error message');

    const errMessage = generateErrorMessage(error);

    expect(errMessage).toStrictEqual('error message');
  });

  test('unrecognized error', () => {
    const errors = [
      'abcdef',
      undefined,
      null,
      { abc: 'def' },
      {
        message: []
      },
      {
        type: [],
      },
      {
        type: [],
        message: []
      },
      {
        type: 'invalid type'
      }
    ];

    errors.forEach((error) => {
      const errMessage = generateErrorMessage(error);

      expect(errMessage).toStrictEqual('unrecognized error');
    });
  });

  test('ldap error', () => {
    const error: Extract<rawError, { type: 'ldapError' }> = {
      type: 'ldapError',
      code: 1,
      name: 'error name'
    };

    const errMessage = generateErrorMessage(error);

    expect(errMessage).toStrictEqual(`code: ${error.code} name: ${error.name}`);
  });

  test('custom error', () => {
    const error: Extract<rawError, { type: 'customErrorMessage' }> = {
      type: 'customErrorMessage',
      message: 'error message'
    };

    const errMessage = generateErrorMessage(error);

    expect(errMessage).toStrictEqual('error message');
  });

  test('custom validation error', () => {
    const error: Extract<rawError, { type: 'validationError' }> = {
      type: 'validationError',
      error: 'custom validation error'
    };

    const errMessage = generateErrorMessage(error);

    expect(errMessage).toStrictEqual('custom validation error');
  });
});
