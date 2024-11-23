import mongoose from 'mongoose';

// Crear un esquema para el seguimiento
const followingSchema = new mongoose.Schema({
  followerUserId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al _id de la colección User
    ref: 'User', // Nombre del modelo al que se relaciona
    required: true,
  },
  followedUserId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al _id de la colección User
    ref: 'User', // Nombre del modelo al que se relaciona
    required: true,
  },
  followUpDate: {
    type: Date,
    required: [true, 'La fecha de recuperación es requerida'],
    default: Date.now,
  },
});

// Crear el modelo a partir del esquema
const followingModel = mongoose.model('Following', followingSchema);

export default followingModel;

