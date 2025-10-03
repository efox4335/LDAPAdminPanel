import express from 'express';
import { prettifyError, ZodError } from 'zod';
import { ResultCodeError } from 'ldapts';

import type { responseError } from '../utils/types';

const errorHandler = (err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (typeof (err) !== 'object') {
    return next(err);
  }

  if (!err) {
    return next(err);
  }

  if (err instanceof ZodError) {
    const error: responseError = {
      type: 'validationError',
      error: prettifyError(err)
    };

    res.status(400).send(error);

    return;
  }

  if (err instanceof ResultCodeError) {
    const error: responseError = {
      type: 'ldapError',
      code: err.code,
      name: err.name
    };

    res.status(400).send(error);

    return;
  }

  next(err);
};

export default errorHandler;
