import mongoose from 'mongoose';

// Crear un esquema para el seguimiento
const followingSchema = new mongoose.Schema({
  followerUserId: {
    type: String,
    required: [true, 'El ID de usuario es requerido'],
    minlength: [3, 'El ID de usuario debe tener al menos 3 caracteres'],
    maxlength: [50, 'El ID de usuario debe tener como máximo 50 caracteres'],
  },
  followedUserId: {
    type: String,
    required: [true, 'El ID de usuario es requerido'],
    minlength: [3, 'El ID de usuario debe tener al menos 3 caracteres'],
    maxlength: [50, 'El ID de usuario debe tener como máximo 50 caracteres'],
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

