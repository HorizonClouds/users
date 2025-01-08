import express from 'express';
import { loginHistoryValidator, loginHistoryIdValidator } from '../middlewares/logInHistoryValidator.js';
import {
  getAllLoginHistory,
  createLoginHistory,
  getLoginHistoryById,
  deleteLoginHistory,
} from '../controllers/logInHistoryController.js';

const router = express.Router();

// Route to get all login history
router.get('/v1/loginHistory', getAllLoginHistory);

// Route to create a new login history record
router.post('/v1/loginHistory', loginHistoryValidator, createLoginHistory);

// Route to get a specific login history record by ID
router.get('/v1/loginHistory/:id', loginHistoryIdValidator, getLoginHistoryById);

// Route to delete a specific login history record by ID
router.delete('/v1/loginHistory/:id', loginHistoryIdValidator, deleteLoginHistory);

export default router;
