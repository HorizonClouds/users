import express from 'express';
import {
  createFollowing,
  getFollowers,
  getFollowedUsers,
  deleteFollowing,
} from '../controllers/followingController.js';

const router = express.Router();

// Ruta para crear un nuevo seguimiento
router.post('/follow', createFollowing);

// Ruta para obtener los seguidores de un usuario
router.get('/followers/:userId', getFollowers);

// Ruta para obtener los usuarios seguidos por un usuario
router.get('/followed/:userId', getFollowedUsers);

// Ruta para eliminar un seguimiento
router.delete('/unfollow/:followerUserId/:followedUserId', deleteFollowing);

export default router;
