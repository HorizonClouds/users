import mongoose from 'mongoose';
import followingModel from '../models/followingModel.js';

export const createFollowing = async (followerUserId, followedUserId) => {
  // Verifica si los IDs son válidos
  if (!mongoose.Types.ObjectId.isValid(followerUserId) || !mongoose.Types.ObjectId.isValid(followedUserId)) {
    throw new Error('Uno o más IDs proporcionados no son válidos.');
  }

  // Verifica que los dos IDs no sean iguales (un usuario no puede seguirse a sí mismo)
  if (followerUserId === followedUserId) {
    throw new Error('No puedes seguirte a ti mismo.');
  }

  // Verifica si ya existe un seguimiento entre los usuarios
  const existingFollowing = await followingModel.findOne({ followerUserId, followedUserId });
  if (existingFollowing) {
    throw new Error('Ya sigues a este usuario');
  }

  // Crea un nuevo seguimiento
  const newFollowing = new followingModel({
    followerUserId,
    followedUserId,
  });
  await newFollowing.save();

  // Devuelve los datos del nuevo seguimiento
  return {
    _id: newFollowing._id.toString(),
    followerUserId: newFollowing.followerUserId.toString(),
    followedUserId: newFollowing.followedUserId.toString(),
    followUpDate: newFollowing.followUpDate.toISOString(),
  };
};

export const getFollowers = async (userId) => {
  // Verifica si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('ID de usuario no válido');
  }

  // Encuentra todos los seguidores de un usuario específico
  const followers = await followingModel.find({ followedUserId: userId });
  
  // Devuelve solo los _id de los seguidores
  return followers.map(follower => follower.followerUserId.toString());
};

export const getFollowedUsers = async (userId) => {
  // Verifica si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('ID de usuario no válido');
  }

  // Encuentra todos los usuarios que un usuario está siguiendo
  const followedUsers = await followingModel.find({ followerUserId: userId });
  
  // Devuelve solo los _id de los usuarios seguidos
  return followedUsers.map(followed => followed.followedUserId.toString());
};

export const deleteFollowing = async (followerUserId, followedUserId) => {
  // Verifica si los IDs son válidos
  if (!mongoose.Types.ObjectId.isValid(followerUserId) || !mongoose.Types.ObjectId.isValid(followedUserId)) {
    throw new Error('Uno o más IDs proporcionados no son válidos.');
  }

  // Elimina un seguimiento si existe
  const deletedFollowing = await followingModel.findOneAndDelete({ followerUserId, followedUserId });
  if (!deletedFollowing) {
    throw new Error('El seguimiento no existe');
  }

  return {
    _id: deletedFollowing._id.toString(),
    followerUserId: deletedFollowing.followerUserId.toString(),
    followedUserId: deletedFollowing.followedUserId.toString(),
    followUpDate: deletedFollowing.followUpDate.toISOString(),
  };
};