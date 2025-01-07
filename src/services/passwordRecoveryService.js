import PasswordRecoveryModel from '../models/passwordRecoveryRequestModel.js';

export const createPasswordRecoveryRequest = async (userId, token) => {
  try {
    logger.debug('Creating password recovery request for userId:', userId);

    // Crear una nueva solicitud de recuperación de contraseña
    const recoveryRequest = new PasswordRecoveryModel({
      userId,
      token,
    });

    // Guardar la solicitud en la base de datos
    await recoveryRequest.save();

    logger.debug('Password recovery request created successfully:', recoveryRequest);
    return recoveryRequest;
  } catch (error) {
    logger.debug('Error creating password recovery request:', error);
    throw new Error('Error al crear la solicitud de recuperación de contraseña: ' + error.message);
  }
};

export const validatePasswordRecoveryToken = async (token) => {
  try {
    logger.debug('Validating password recovery token:', token);

    // Buscar la solicitud de recuperación por token
    const recoveryRequest = await PasswordRecoveryModel.findOne({ token });

    if (!recoveryRequest) {
      logger.debug('Password recovery token not found');
      throw new Error('Token de recuperación no encontrado');
    }

    // Verificar si el token ha expirado
    if (recoveryRequest.expiresTokenTime < Date.now()) {
      logger.debug('Password recovery token expired');
      throw new Error('Token de recuperación expirado');
    }

    logger.debug('Password recovery token is valid');
    return true;
  } catch (error) {
    logger.debug('Error validating password recovery token:', error);
    console.error(error);
    return false;
  }
};