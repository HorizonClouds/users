// services/followingService.js
import followingModel from '../models/followingModel.js';
import User from '../models/userModel.js';

export const createFollowing = async (followerUserId, followedUserId) => {
  logger.info('Attempting to create a following relationship between user:', followerUserId, 'and user:', followedUserId);

  // Verifica si ya existe un seguimiento entre estos usuarios
  const existingFollowing = await followingModel.findOne({ followerUserId, followedUserId });
  if (existingFollowing) {
    logger.info('Following relationship already exists between users:', followerUserId, followedUserId);
    throw new Error('Ya sigues a este usuario');
  }

  // Crea el seguimiento
  const newFollowing = new followingModel({ followerUserId, followedUserId });
  await newFollowing.save();
  logger.info('Following relationship created successfully:', newFollowing);

  // Aseguramos que los valores ObjectId se devuelvan como string
  return {
    _id: newFollowing._id.toString(),
    followerUserId: newFollowing.followerUserId.toString(),
    followedUserId: newFollowing.followedUserId.toString(),
    followUpDate: newFollowing.followUpDate.toISOString(),
  };
};

export const getFollowers = async (userId) => {
  logger.info('Getting followers for user:', userId);

  // Encuentra todos los seguidores de un usuario específico
  const followers = await followingModel.find({ followedUserId: userId }).populate('followerUserId', 'name email');
  logger.info('Followers found:', followers);
  return followers;
};

export const getFollowedUsers = async (userId) => {
  logger.info('Getting followed users for user:', userId);

  // Encuentra todos los usuarios que un usuario está siguiendo
  const followedUsers = await followingModel.find({ followerUserId: userId }).populate('followedUserId', 'name email');
  logger.info('Followed users found:', followedUsers);
  return followedUsers;
};

export const deleteFollowing = async (followerUserId, followedUserId) => {
  logger.info('Attempting to delete following relationship between user:', followerUserId, 'and user:', followedUserId);

  // Elimina un seguimiento si existe
  const deletedFollowing = await followingModel.findOneAndDelete({ followerUserId, followedUserId });
  if (!deletedFollowing) {
    logger.info('No following relationship found to delete between users:', followerUserId, followedUserId);
    throw new Error('El seguimiento no existe');
  }
  logger.info('Following relationship deleted:', deletedFollowing);

  return {
    _id: deletedFollowing._id.toString(),
    followerUserId: deletedFollowing.followerUserId.toString(),
    followedUserId: deletedFollowing.followedUserId.toString(),
    followUpDate: deletedFollowing.followUpDate.toISOString(),
  };
};
