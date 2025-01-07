import { body, validationResult } from 'express-validator';
import { ValidationError } from '../utils/customErrors.js';
import logger from '../utils/logger.js'; // Asegúrate de que esta importación sea correcta

export const userValidator = [
  // Validate 'name' field
  body('name')
    .exists({ checkNull: true })
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long')
    .isLength({ max: 50 })
    .withMessage('Name must be at most 50 characters long'),

  // Validate 'photo' field
  body('photo')
    .exists({ checkNull: true })
    .withMessage('Photo is required')
    .isString()
    .withMessage('Photo must be a string')
    .isURL()
    .withMessage('Photo must be a valid URL'),

  // Validate 'biography' field
  body('biography')
    .exists({ checkNull: true })
    .withMessage('Biography is required')
    .isString()
    .withMessage('Biography must be a string')
    .isLength({ max: 500 })
    .withMessage('Biography must be at most 500 characters long'),

  // Validate 'email' field
  body('email')
    .exists({ checkNull: true })
    .withMessage('Email is required')
    .isString()
    .withMessage('Email must be a string')
    .isEmail()
    .withMessage('Email must be a valid email address'),

  // Validate 'password' field
  body('password')
    .exists({ checkNull: true })
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .isLength({ max: 20 })
    .withMessage('Password must be at most 20 characters long'),

  // Validate 'registrationDate' field (optional for updates)
  body('registrationDate')
    .optional()
    .isISO8601()
    .withMessage('Registration date must be a valid ISO 8601 date'),

  // Validate 'accountStatus' field
  body('accountStatus')
    .optional()
    .isString()
    .withMessage('Account status must be a string')
    .isIn(['active', 'inactive'])
    .withMessage('Account status must be "active" or "inactive"'),

  // Validate 'friendRequestStatus' field
  body('friendRequestStatus')
    .optional()
    .isString()
    .withMessage('Friend request status must be a string')
    .isIn(['pending', 'accepted', 'rejected'])
    .withMessage('Friend request status must be "pending", "accepted", or "rejected"'),

  // Middleware to handle validation errors
  (req, res, next) => {
    try {
      logger.debug('Starting validation process for user input');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.debug('Validation failed with errors:', errors.array());
        throw new ValidationError('Validation failed', errors.array());
      }
      logger.debug('Validation passed successfully');
      next();
    } catch (error) {
      logger.debug(`Error in validation: ${error.message}`);
      res.status(400).json({ error: error.message, details: error.errors || [] });
    }
  },
];