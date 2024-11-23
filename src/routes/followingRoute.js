import express from 'express';
import {
  createFollowing,
  getFollowers,
  getFollowedUsers,
  deleteFollowing,
} from '../controllers/followingController.js';

const router = express.Router();

// Ruta para crear un nuevo seguimiento
router.post('/v1/follow', createFollowing);

// Ruta para obtener los seguidores de un usuario
router.get('/v1/followers/:userId', getFollowers);

// Ruta para obtener los usuarios seguidos por un usuario
router.get('/v1/followed/:userId', getFollowedUsers);

// Ruta para eliminar un seguimiento
router.delete('/v1/unfollow/:followerUserId/:followedUserId', deleteFollowing);

export default router;
