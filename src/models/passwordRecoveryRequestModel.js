import mongoose from 'mongoose';

// Esquema para solicitudes de recuperación de contraseña
const passwordRecoverySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'El ID de usuario es requerido'],
    minlength: [3, 'El ID de usuario debe tener al menos 3 caracteres'],
    maxlength: [50, 'El ID de usuario debe tener como máximo 50 caracteres'],
  },
  token: {
    type: String,
    required: [true, 'El token es requerido'],
  },
  recoveryDate: {
    type: Date,
    required: [true, 'La fecha de recuperación es requerida'],
    default: Date.now,
  },
  expiresTokenTime: {
    type: Date,
    required: true,
    default: () => Date.now() + 1800000, // Token expira en media hora (1800000 ms)
  },
});

// Crear el modelo a partir del esquema
const PasswordRecoveryModel = mongoose.model('PasswordRecoveryRequest', passwordRecoverySchema);

export default PasswordRecoveryModel;
