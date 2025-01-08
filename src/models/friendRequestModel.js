import mongoose from 'mongoose';

// Esquema para la solicitud de amistad
const friendRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al _id de la colección User
    ref: 'User', // Nombre del modelo al que se relaciona
    required: true,
  },
  recipientUserId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al _id de la colección User
    ref: 'User', // Nombre del modelo al que se relaciona
    required: true,
  },
  friendRequestStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending', // Estado por defecto: pendiente
    required: [false, 'El estado de la solicitud es requerido'],
  },
});

// Crear el modelo a partir del esquema
const FriendRequestModel = mongoose.model('FriendRequest', friendRequestSchema);

export default FriendRequestModel;

