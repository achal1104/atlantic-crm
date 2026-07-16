import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  if (status >= 500) console.error('[error]', err.stack || err.message?.replace(/[\r\n]/g, ' '));

  res.status(status).json({ success: false, message });
};
