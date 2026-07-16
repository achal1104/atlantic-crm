import { Request, Response, NextFunction } from 'express';

function clean(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, clean(v)])
    );
  }
  return value;
}

export const sanitize = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) req.body = clean(req.body);
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        (req.query as any)[key] = clean(req.query[key]);
      }
    }
  }
  next();
};
