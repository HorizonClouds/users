import mongoose from 'mongoose';

// Esquema para la solicitud de amistad
const friendRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'El ID de usuario es requerido'],
    minlength: [3, 'El ID de usuario debe tener al menos 3 caracteres'],
    maxlength: [50, 'El ID de usuario debe tener como máximo 50 caracteres'],
  },
  recipientUserId: {
    type: String,
    required: [true, 'El ID de usuario destinatario es requerido'],
    minlength: [3, 'El ID de usuario destinatario debe tener al menos 3 caracteres'],
    maxlength: [50, 'El ID de usuario destinatario debe tener como máximo 50 caracteres'],
  },
  friendRequestStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending', // Estado por defecto: pendiente
    required: [true, 'El estado de la solicitud es requerido'],
  },
});

// Crear el modelo a partir del esquema
const FriendRequestModel = mongoose.model('FriendRequest', friendRequestSchema);

export default FriendRequestModel;

