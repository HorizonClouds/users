import mongoose from 'mongoose';

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al _id de la colección User
    ref: 'User', // Nombre del modelo al que se relaciona
    required: true,
  },
  loginDate: {
    type: Date,
    default: Date.now, // Establece la fecha y hora actuales por defecto
  },
});

// Crea el modelo LoginHistory
const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

export default LoginHistory;
