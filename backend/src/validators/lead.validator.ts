import { body } from 'express-validator';
import { validate } from './auth.validator.js';

export const createLeadValidator = [
  body('name').trim().notEmpty().withMessage('Lead name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('leadScore').optional().isInt({ min: 0, max: 100 }).withMessage('Lead score must be between 0 and 100'),
  validate,
];

export const updateLeadValidator = [
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('leadScore').optional().isInt({ min: 0, max: 100 }).withMessage('Lead score must be between 0 and 100'),
  validate,
];
