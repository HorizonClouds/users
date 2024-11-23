
import crypto from 'crypto';
import PasswordRecoveryModel from '../models/passwordRecoveryRequestModel.js';
import { ValidationError } from '../utils/customErrors.js';

// Función para eliminar campos específicos de documentos MongoDB
const removeMongoFields = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => {
      const { __v, ...rest } = item.toObject();
      return rest;
    });
  } else {
    const { __v, ...rest } = data.toObject();
    return rest;
  }
};

// Función para generar un token único y seguro
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Crear o reemplazar una solicitud de recuperación
export const createPasswordRecoveryRequest = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Validar que el ID de usuario esté presente
    if (!userId) {
      throw new ValidationError('El ID de usuario es requerido', [
        { field: 'userId', msg: 'Este campo es obligatorio' },
      ]);
    }

    // Eliminar solicitud existente si la hay
    await PasswordRecoveryModel.findOneAndDelete({ userId });

    // Crear nueva solicitud de recuperación
    const newRequest = new PasswordRecoveryModel({ 
      userId, 
      token: generateToken(),
      expiresTokenTime: Date.now() + 3600000, // Token expira en 1 hora
    });
    await newRequest.save();

    res.status(201).json({
      success: true,
      message: 'Solicitud de recuperación creada exitosamente',
      data: removeMongoFields(newRequest),
    });
  } catch (error) {
    // Manejo de errores personalizados
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validación fallida',
        errors: error.errors,
      });
    }

    // Delegar otros errores al middleware de errores global
    next(error);
  }
};

// Validar un token de recuperación
export const validateRecoveryToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Buscar la solicitud por token
    const recoveryRequest = await PasswordRecoveryModel.findOne({ token });

    // Verificar si el token existe y no ha expirado
    if (!recoveryRequest || recoveryRequest.expiresTokenTime < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token válido',
      data: removeMongoFields(recoveryRequest),
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Eliminar una solicitud de recuperación
export const deletePasswordRecoveryRequest = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Buscar y eliminar la solicitud por token
    const deletedRequest = await PasswordRecoveryModel.findOneAndDelete({ token });

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Solicitud eliminada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};