import passwordRecoveryModel from '../models/passwordRecoveryRequestModel.js';

export const validateRecoveryToken = async (req, res, next) => {
  const { token } = req.params;

  try {
    const recoveryRequest = await passwordRecoveryModel.findOne({ token });

    if (!recoveryRequest || recoveryRequest.expiresTokenTime < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    req.recoveryRequest = recoveryRequest; // Añade la solicitud a la request para uso posterior
    next();
  } catch (error) {
    next(error);
  }
};
