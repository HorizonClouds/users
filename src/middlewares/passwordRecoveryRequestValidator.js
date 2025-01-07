import Joi from 'joi';
import logger from '../utils/logger.js'; // Asegúrate de que esta importación sea correcta

export const passwordRecoveryRequestValidator = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().min(3).max(50).required().messages({
      'string.base': 'El ID de usuario debe ser un texto',
      'string.min': 'El ID de usuario debe tener al menos 3 caracteres',
      'string.max': 'El ID de usuario debe tener como máximo 50 caracteres',
      'any.required': 'El ID de usuario es requerido',
    }),
  });

  logger.debug('Starting password recovery request validation', req.body);

  const { error } = schema.validate(req.body);

  if (error) {
    logger.debug('Validation error occurred', error.details);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.details.map((err) => ({ field: err.context.key, msg: err.message })),
    });
  }

  logger.debug('Password recovery request validated successfully');
  next();
};