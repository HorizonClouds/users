import * as followingService from '../services/followingService.js';

export const createFollowing = async (req, res) => {
  try {
    const { followerUserId, followedUserId } = req.body;
    logger.debug(`Creating following request: followerUserId=${followerUserId}, followedUserId=${followedUserId}`);

    const following = await followingService.createFollowing(followerUserId, followedUserId);

    logger.debug(`Following created successfully: ${JSON.stringify(following)}`);
    res.status(201).json({ status: 'success', message: 'Seguimiento creado con éxito', data: following });
  } catch (error) {
    logger.debug(`Error in creating following: ${error.message}`);
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    logger.debug(`Fetching followers for userId=${userId}`);

    const followers = await followingService.getFollowers(userId);

    logger.debug(`Followers fetched successfully: ${JSON.stringify(followers)}`);
    res.status(200).json({ status: 'success', data: followers });
  } catch (error) {
    logger.debug(`Error in fetching followers: ${error.message}`);
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const getFollowedUsers = async (req, res) => {
  try {
    const { userId } = req.params;
    logger.debug(`Fetching followed users for userId=${userId}`);

    const followedUsers = await followingService.getFollowedUsers(userId);

    logger.debug(`Followed users fetched successfully: ${JSON.stringify(followedUsers)}`);
    res.status(200).json({ status: 'success', data: followedUsers });
  } catch (error) {
    logger.debug(`Error in fetching followed users: ${error.message}`);
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const deleteFollowing = async (req, res) => {
  try {
    const { followerUserId, followedUserId } = req.params;
    logger.debug(`Deleting following: followerUserId=${followerUserId}, followedUserId=${followedUserId}`);

    const deletedFollowing = await followingService.deleteFollowing(followerUserId, followedUserId);

    logger.debug(`Following deleted successfully: ${JSON.stringify(deletedFollowing)}`);
    res.status(200).json({ status: 'success', message: 'Seguimiento eliminado con éxito', data: deletedFollowing });
  } catch (error) {
    logger.debug(`Error in deleting following: ${error.message}`);
    res.status(404).json({ status: 'error', message: error.message });
  }
};