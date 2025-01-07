import { body, param, validationResult } from 'express-validator';
import { ValidationError } from '../utils/customErrors.js';

export const loginHistoryValidator = [
  // Validate 'userId' field
  body('userId')
    .exists({ checkNull: true })
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('User ID must be a valid MongoDB ObjectId'),

  // Validate 'loginDate' field
  body('loginDate')
    .optional() // The field is optional, but if provided, it must pass validation
    .isISO8601()
    .withMessage('Login date must be a valid ISO 8601 date'),

  // Middleware to handle validation errors
  (req, res, next) => {
    try {
      logger.info('Validating login history request', req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.info('Validation failed', errors.array());
        throw new ValidationError('Validation failed', errors.array());
      }

      logger.info('Validation succeeded');
      next();
    } catch (error) {
      logger.error('Validation error', error);
      res.status(400).json({ error: error.message, details: error.errors || [] });
    }
  },
];

export const loginHistoryIdValidator = [
  // Validate 'id' parameter (for routes with :id)
  param('id')
    .exists()
    .withMessage('Login history ID is required')
    .isMongoId()
    .withMessage('Login history ID must be a valid MongoDB ObjectId'),

  // Middleware to handle validation errors
  (req, res, next) => {
    try {
      logger.info('Validating login history ID parameter', req.params.id);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.info('Validation failed', errors.array());
        throw new ValidationError('Validation failed', errors.array());
      }

      logger.info('Validation succeeded');
      next();
    } catch (error) {
      logger.error('Validation error', error);
      res.status(400).json({ error: error.message, details: error.errors || [] });
    }
  },
];