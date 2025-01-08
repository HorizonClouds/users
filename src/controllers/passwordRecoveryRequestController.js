import * as passwordRecoveryService from '../services/passwordRecoveryService.js';

export const changeUserPassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    const result = await passwordRecoveryService.changeUserPassword(
      userId,
      currentPassword,
      newPassword
    );

    return res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
