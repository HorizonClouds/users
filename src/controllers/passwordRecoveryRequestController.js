import * as passwordRecoveryService from '../services/passwordRecoveryService.js';

export const createPasswordRecoveryRequest = async (req, res) => {
  try {
    const { userId, token } = req.body;

    // Llamada al servicio para crear la solicitud de recuperación
    const recoveryRequest = await passwordRecoveryService.createPasswordRecoveryRequest(userId, token);

    return res.status(201).json({
      status: 'success',
      message: 'Solicitud de recuperación de contraseña creada correctamente',
      data: recoveryRequest,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const validatePasswordRecoveryToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Llamada al servicio para validar el token de recuperación
    const isValid = await passwordRecoveryService.validatePasswordRecoveryToken(token);

    if (isValid) {
      return res.status(200).json({
        status: 'success',
        message: 'Token de recuperación válido',
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Token de recuperación no válido o expirado',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
