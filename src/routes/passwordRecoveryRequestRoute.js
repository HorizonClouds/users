import express from 'express';
import * as passwordRecovery from '../controllers/passwordRecoveryRequestController.js';
import { validateRecoveryToken} from '../middlewares/recoveryTokenValidator.js';
import { passwordRecoveryRequestValidator } from '../middlewares/passwordRecoveryRequestValidator.js';

const router = express.Router();

// Define routes
router.post('/v1/password-recovery-request',passwordRecoveryRequestValidator, passwordRecovery.createPasswordRecoveryRequest);
router.put('/v1/password-recovery-request/:recoveryToken',validateRecoveryToken,passwordRecovery.validateRecoveryToken);

export default router;
