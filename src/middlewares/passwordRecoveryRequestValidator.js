import Joi from 'joi';

export const validatePasswordChange = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required().messages({
      'string.base': 'El ID de usuario debe ser un texto',
      'any.required': 'El ID de usuario es requerido',
    }),
    currentPassword: Joi.string().min(6).required().messages({
      'string.min': 'La contraseña actual debe tener al menos 6 caracteres',
      'any.required': 'La contraseña actual es requerida',
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'La nueva contraseña debe tener al menos 6 caracteres',
      'any.required': 'La nueva contraseña es requerida',
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Error de validación',
      errors: error.details.map((err) => ({ field: err.context.key, msg: err.message })),
    });
  }

  next();
};
