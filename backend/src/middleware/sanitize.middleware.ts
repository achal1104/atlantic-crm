import { Request, Response, NextFunction } from 'express';

const sanitizeString = (str: string): string =>
  str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, sanitizeObject(v)]));
  }
  return obj;
};

export const sanitize = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) {
    const sanitized = sanitizeObject(req.query);
    Object.keys(sanitized).forEach((k) => { (req.query as any)[k] = sanitized[k]; });
  }
  next();
};
