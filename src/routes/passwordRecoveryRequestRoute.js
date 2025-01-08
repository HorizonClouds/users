import express from 'express';
import { changeUserPassword } from '../controllers/passwordRecoveryRequestController.js';
import { validatePasswordChange } from '../middlewares/passwordRecoveryRequestValidator.js';

const router = express.Router();

// Ruta para cambiar la contraseña del usuario
router.put('/v1/password/change', validatePasswordChange, changeUserPassword);

export default router;
