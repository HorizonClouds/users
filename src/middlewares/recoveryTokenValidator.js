import passwordRecoveryModel from '../models/passwordRecoveryRequestModel.js';

export const validateRecoveryToken = async (req, res, next) => {
  const { token } = req.params;

  logger.info(`Received password recovery token validation request for token: ${token}`);

  try {
    const recoveryRequest = await passwordRecoveryModel.findOne({ token });

    if (!recoveryRequest) {
      logger.info(`No recovery request found for token: ${token}`);
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    if (recoveryRequest.expiresTokenTime < Date.now()) {
      logger.info(`Recovery token expired for token: ${token}`);
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    logger.info(`Token validated successfully for token: ${token}`);
    req.recoveryRequest = recoveryRequest; // Añade la solicitud a la request para uso posterior
    next();
  } catch (error) {
    logger.info(`Error during token validation for token: ${token}`, error);
    next(error);
  }
};