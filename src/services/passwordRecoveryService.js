import PasswordRecoveryModel from '../models/passwordRecoveryRequestModel.js';

export const createPasswordRecoveryRequest = async (userId, token) => {
  try {
    // Crear una nueva solicitud de recuperación de contraseña
    const recoveryRequest = new PasswordRecoveryModel({
      userId,
      token,
    });

    // Guardar la solicitud en la base de datos
    await recoveryRequest.save();

    return recoveryRequest;
  } catch (error) {
    throw new Error('Error al crear la solicitud de recuperación de contraseña: ' + error.message);
  }
};

export const validatePasswordRecoveryToken = async (token) => {
  try {
    // Buscar la solicitud de recuperación por token
    const recoveryRequest = await PasswordRecoveryModel.findOne({ token });

    if (!recoveryRequest) {
      throw new Error('Token de recuperación no encontrado');
    }

    // Verificar si el token ha expirado
    if (recoveryRequest.expiresTokenTime < Date.now()) {
      throw new Error('Token de recuperación expirado');
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
