import followingModel from '../models/followingModel.js';

export const createFollowing = async (followerUserId, followedUserId) => {
  // Verifica si ya existe un seguimiento entre estos usuarios
  const existingFollowing = await followingModel.findOne({ followerUserId, followedUserId });
  if (existingFollowing) {
    throw new Error('Ya sigues a este usuario');
  }

  // Crea el seguimiento
  const newFollowing = new followingModel({ followerUserId, followedUserId });
  return await newFollowing.save();
};

export const getFollowers = async (userId) => {
  // Encuentra todos los seguidores de un usuario específico
  return await followingModel.find({ followedUserId: userId }).populate('followerUserId', 'name email');
};

export const getFollowedUsers = async (userId) => {
  // Encuentra todos los usuarios que un usuario está siguiendo
  return await followingModel.find({ followerUserId: userId }).populate('followedUserId', 'name email');
};

export const deleteFollowing = async (followerUserId, followedUserId) => {
  // Elimina un seguimiento si existe
  const deletedFollowing = await followingModel.findOneAndDelete({ followerUserId, followedUserId });
  if (!deletedFollowing) {
    throw new Error('El seguimiento no existe');
  }
  return deletedFollowing;
};
