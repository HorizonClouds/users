import express from 'express';
import { loginHistoryValidator, loginHistoryIdValidator } from '../middlewares/validators.js';
import {
  getAllLoginHistory,
  createLoginHistory,
  getLoginHistoryById,
  deleteLoginHistory,
} from '../controllers/logInHistoryController.js';

const router = express.Router();

// Route to get all login history
router.get('/', getAllLoginHistory);

// Route to create a new login history record
router.post('/', loginHistoryValidator, createLoginHistory);

// Route to get a specific login history record by ID
router.get('/:id', loginHistoryIdValidator, getLoginHistoryById);

// Route to delete a specific login history record by ID
router.delete('/:id', loginHistoryIdValidator, deleteLoginHistory);

export default router;
