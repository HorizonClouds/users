import express from 'express';
import {
  getAllUsers,
  createUser,
  getUsersById,
  updateUsers,
  deleteUsers,
} from '../controllers/exampleController.js';
import { userValidator } from '../middlewares/userValidator.js';

const router = express.Router();

// Route to get all examples
router.get('/v1/users', getAllUsers);

// Route to create a new example
router.post('/v1/users', userValidator, createUser);

// Route to get a specific example by ID
router.get('/v1/users/:id', getUsersById);

// Route to update an example by ID
router.put('/v1/users/:id', userValidator, updateUsers);

// Route to delete an example by ID
router.delete('/v1/users/:id', deleteUsers);

export default router;
