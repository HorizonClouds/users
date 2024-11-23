import followingModel from '../models/followingModel.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';

// Función para crear un nuevo seguimiento (follow)
export const createFollowing = async (followerUserId, followedUserId) => {
  // Validar que ambos IDs de usuario estén presentes
  if (!followerUserId || !followedUserId) {
    throw new ValidationError('Los IDs de usuario son requeridos', [
      { field: 'followerUserId', msg: 'Este campo es obligatorio' },
      { field: 'followedUserId', msg: 'Este campo es obligatorio' },
    ]);
  }

  // Verificar si el seguimiento ya existe
  const existingFollow = await followingModel.findOne({ followerUserId, followedUserId });
  if (existingFollow) {
    throw new ValidationError('Ya sigues a este usuario');
  }

  // Crear un nuevo seguimiento
  const newFollow = new followingModel({
    followerUserId,
    followedUserId,
    followUpDate: Date.now(),
  });

  await newFollow.save();
  return newFollow;
};

// Obtener todos los seguidores de un usuario
export const getFollowers = async (userId) => {
  // Buscar los seguidores del usuario
  const followers = await followingModel.find({ followedUserId: userId });
  if (!followers || followers.length === 0) {
    throw new NotFoundError('No se encontraron seguidores para este usuario');
  }

  return followers;
};

// Obtener todos los usuarios que sigue un usuario
export const getFollowedUsers = async (userId) => {
  // Buscar los usuarios que este usuario sigue
  const followedUsers = await followingModel.find({ followerUserId: userId });
  if (!followedUsers || followedUsers.length === 0) {
    throw new NotFoundError('No se encontraron usuarios que sigas');
  }

  return followedUsers;
};

// Eliminar un seguimiento (unfollow)
export const deleteFollowing = async (followerUserId, followedUserId) => {
  // Buscar y eliminar el seguimiento
  const deletedFollow = await followingModel.findOneAndDelete({
    followerUserId,
    followedUserId,
  });

  if (!deletedFollow) {
    throw new NotFoundError('No se encontró el seguimiento');
  }

  return deletedFollow;
};
