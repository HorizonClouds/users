import * as passwordRecoveryService from '../services/passwordRecoveryService.js';

export const createPasswordRecoveryRequest = async (req, res) => {
  try {
    const { userId, token } = req.body;
    logger.debug(`Creating password recovery request for userId=${userId} with token=${token}`);

    // Llamada al servicio para crear la solicitud de recuperación
    const recoveryRequest = await passwordRecoveryService.createPasswordRecoveryRequest(userId, token);

    logger.debug(`Password recovery request created successfully: ${JSON.stringify(recoveryRequest)}`);

    return res.status(201).json({
      status: 'success',
      message: 'Solicitud de recuperación de contraseña creada correctamente',
      data: recoveryRequest,
    });
  } catch (error) {
    logger.debug(`Error in creating password recovery request: ${error.message}`);
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
    logger.debug(`Validating password recovery token: ${token}`);

    // Llamada al servicio para validar el token de recuperación
    const isValid = await passwordRecoveryService.validatePasswordRecoveryToken(token);

    if (isValid) {
      logger.debug(`Password recovery token validated successfully: ${token}`);
      return res.status(200).json({
        status: 'success',
        message: 'Token de recuperación válido',
      });
    } else {
      logger.debug(`Invalid or expired password recovery token: ${token}`);
      return res.status(400).json({
        status: 'error',
        message: 'Token de recuperación no válido o expirado',
      });
    }
  } catch (error) {
    logger.debug(`Error in validating password recovery token: ${error.message}`);
    console.error(error);
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};