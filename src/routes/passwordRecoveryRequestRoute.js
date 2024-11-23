import express from 'express';
import * as passwordRecovery from '../controllers/passwordRecoveryRequestController.js';
import { validateRecoveryToken } from '../middlewares/recoveryTokenValidator.js';
import { passwordRecoveryRequestValidator } from '../middlewares/passwordRecoveryRequestValidator.js';

const router = express.Router();

// Ruta para crear una solicitud de recuperación de contraseña
router.post('/v1/password-recovery-request', passwordRecoveryRequestValidator, passwordRecovery.createPasswordRecoveryRequest);

// Ruta para actualizar una solicitud de recuperación de contraseña (validar el token y luego actualizar)
router.put('/v1/password-recovery-request/:recoveryToken', validateRecoveryToken, passwordRecovery.validatePasswordRecoveryToken);

export default router;
