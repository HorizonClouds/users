import * as followingService from '../services/followingService.js';

export const createFollowing = async (req, res) => {
  try {
    const { followerUserId, followedUserId } = req.body;
    const following = await followingService.createFollowing(followerUserId, followedUserId);
    res.status(201).json({ status: 'success', message: 'Seguimiento creado con éxito', data: following });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await followingService.getFollowers(userId);
    res.status(200).json({ status: 'success', data: followers });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const getFollowedUsers = async (req, res) => {
  try {
    const { userId } = req.params;
    const followedUsers = await followingService.getFollowedUsers(userId);
    res.status(200).json({ status: 'success', data: followedUsers });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const deleteFollowing = async (req, res) => {
  try {
    const { followerUserId, followedUserId } = req.params;
    const deletedFollowing = await followingService.deleteFollowing(followerUserId, followedUserId);
    res.status(200).json({ status: 'success', message: 'Seguimiento eliminado con éxito', data: deletedFollowing });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};
