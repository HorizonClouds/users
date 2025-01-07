import express from 'express';
import {
  createFollowing,
  getFollowers,
  getFollowedUsers,
  deleteFollowing,
} from '../controllers/followingController.js';

const router = express.Router();

router.post('/v1/follow', createFollowing);
router.get('/v1/followers/:userId', getFollowers);
router.get('/v1/followed/:userId', getFollowedUsers);
router.delete('/v1/unfollow/:followerUserId/:followedUserId', deleteFollowing);

export default router;