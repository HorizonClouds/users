import * as followingService from '../services/followingService.js';

export const createFollowing = async (req, res) => {
  try {
    const { followerUserId, followedUserId } = req.body;

    // Verifica que los campos sean proporcionados
    if (!followerUserId || !followedUserId) {
      return res.status(400).json({ status: 'error', message: 'Ambos IDs son requeridos.' });
    }

    // Llama al servicio para crear el seguimiento
    const following = await followingService.createFollowing(followerUserId, followedUserId);

    // Responde con los datos del seguimiento creado
    res.status(201).json({ status: 'success', message: 'Seguimiento creado con éxito', data: following });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Llama al servicio para obtener los seguidores
    const followers = await followingService.getFollowers(userId);

    // Responde con los seguidores (solo IDs)
    res.status(200).json({ status: 'success', data: followers });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const getFollowedUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Llama al servicio para obtener los usuarios seguidos
    const followedUsers = await followingService.getFollowedUsers(userId);

    // Responde con los usuarios seguidos (solo IDs)
    res.status(200).json({ status: 'success', data: followedUsers });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const deleteFollowing = async (req, res) => {
  try {
    const { followerUserId, followedUserId } = req.params;

    // Llama al servicio para eliminar el seguimiento
    const deletedFollowing = await followingService.deleteFollowing(followerUserId, followedUserId);

    // Responde con el seguimiento eliminado
    res.status(200).json({ status: 'success', message: 'Seguimiento eliminado con éxito', data: deletedFollowing });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};