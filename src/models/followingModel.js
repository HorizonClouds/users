import mongoose from 'mongoose';

// Crear un esquema para el seguimiento
const followingSchema = new mongoose.Schema({
  followerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  followedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  followUpDate: {
    type: Date,
    required: [true, 'La fecha de seguimiento es requerida'],
    default: Date.now,
  },
});

// Crear el modelo a partir del esquema
const followingModel = mongoose.model('Following', followingSchema);

export default followingModel;