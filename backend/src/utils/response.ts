import { Response } from 'express';

export const sendSuccess = (res: Response, data: object, statusCode = 200) => {
  res.status(statusCode).json({ success: true, ...data });
};

export const sendError = (res: Response, message: string, statusCode = 500) => {
  res.status(statusCode).json({ success: false, message });
};
