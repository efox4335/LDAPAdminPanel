import express from 'express';

import writeToLog from '../utils/logger';

export const loggerMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.on('finish', () => {
    writeToLog(`endpoint: ${req.originalUrl} method: ${req.method} response status: ${res.statusCode}`);
  });

  next();
};
