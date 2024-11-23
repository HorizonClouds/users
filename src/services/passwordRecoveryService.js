import PasswordRecoveryModel from '../models/PasswordModel.js';
import { ValidationError } from '../utils/customErrors.js';
import crypto from 'crypto';

// Función para generar un token único y seguro
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Función para crear una solicitud de recuperación de contraseña
export const createPasswordRecoveryRequest = async (userId) => {
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
  return newRequest;
};

// Función para validar un token de recuperación
export const validateRecoveryToken = async (token) => {
  // Buscar la solicitud por token
  const recoveryRequest = await PasswordRecoveryModel.findOne({ token });

  // Verificar si el token existe y no ha expirado
  if (!recoveryRequest || recoveryRequest.expiresTokenTime < Date.now()) {
    throw new ValidationError('Token inválido o expirado');
  }

  return recoveryRequest;
};

// Función para eliminar una solicitud de recuperación
export const deletePasswordRecoveryRequest = async (token) => {
  // Buscar y eliminar la solicitud por token
  const deletedRequest = await PasswordRecoveryModel.findOneAndDelete({ token });

  if (!deletedRequest) {
    throw new ValidationError('Solicitud no encontrada');
  }

  return deletedRequest;
};
