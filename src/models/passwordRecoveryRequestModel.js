import mongoose from 'mongoose';

// Esquema para solicitudes de recuperación de contraseña
const passwordRecoverySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al _id de la colección User
    ref: 'User', // Nombre del modelo al que se relaciona
    required: true,
  },
  token: {
    type: String,
    required: [false, 'El token es requerido'],
  },
  recoveryDate: {
    type: Date,
    required: [false, 'La fecha de recuperación es requerida'],
    default: Date.now,
  },
  expiresTokenTime: {
    type: Date,
    required: false,
    default: () => Date.now() + 1800000, // Token expira en media hora (1800000 ms)
  },
});

// Crear el modelo a partir del esquema
const PasswordRecoveryModel = mongoose.model('PasswordRecoveryRequest', passwordRecoverySchema);

export default PasswordRecoveryModel;
