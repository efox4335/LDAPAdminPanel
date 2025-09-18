import express from 'express';

import writeToLog from '../utils/logger';

export const loggerMiddleware = (req: express.Request, rsp: express.Response, next: express.NextFunction) => {
  rsp.on('finish', () => {
    writeToLog(`endpoint: ${req.originalUrl} method: ${req.method} response status: ${rsp.statusCode}`);
  });

  next();
};
