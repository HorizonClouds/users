import UsersModel from '../models/userModel.js';
import { NotFoundError, BadRequestError } from '../utils/customErrors.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { sendSuccess, sendError } from '../utils/standardResponse.js';

const router = express.Router();
router.use(express.json());

export const getAllUsers = async () => {
  try {
    logger.info('Fetching all users');
    return await UsersModel.find({});
  } catch (error) {
    logger.info('Error fetching users', error);
    throw new BadRequestError('Error fetching users', error);
  }
};

export const createUser = async (data) => {
  try {
    logger.info('Creating new user with data:', data);
    const newExample = new UsersModel(data);
    return await newExample.save();
  } catch (error) {
    logger.info('Error creating user', error);
    throw new BadRequestError('Error creating user', error);
  }
};

export const login = async (data, res) => {
  const { userName, password } = data;
  logger.info('Login attempt with username:', userName);

  const user = await UsersModel.findOne({ name: userName, password: password });
  if (!user) {
    logger.info('Invalid credentials, user not found');
    return sendError(res, {
      statusCode: 401,
      message: 'Invalid credentials',
      appCode: 'UNAUTHORIZED'
    });
  }
  
  logger.info(`User found: ${user.userId}`);
  const tokenPayload = {
    user: {
      user: user.name,
      id: user._id,
      roles: user.roles,
    }
  };
  const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '3h' });
  
  logger.info(`User ${user.userId} authenticated successfully`);
  logger.info(`Generated token: ${token}`);
  logger.info(`Token payload: ${JSON.stringify(tokenPayload)}`);
  
  return sendSuccess(res, {
    message: 'Authentication successful',
    data: { token, secret: config.jwtSecret, expiresIn: '3h', payload: tokenPayload }
  });
};

export const getUsersById = async (id) => {
  try {
    logger.info('Fetching user by ID:', id);
    const example = await UsersModel.findById(id);
    if (!example) {
      logger.info('User not found');
      throw new NotFoundError('user not found');
    }
    return example;
  } catch (error) {
    logger.info('Error fetching user by ID', error);
    throw new NotFoundError('user not found');
  }
};

export const updateUsers = async (id, data) => {
  try {
    logger.info('Updating user with ID:', id, 'and data:', data);
    const updatedExample = await UsersModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedExample) {
      logger.info('User not found');
      throw new NotFoundError('user not found');
    }
    return updatedExample;
  } catch (error) {
    logger.info('Error updating user', error);
    throw new NotFoundError('user not found');
  }
};

export const deleteUsers = async (id) => {
  try {
    logger.info('Deleting user with ID:', id);
    const deletedExample = await UsersModel.findByIdAndDelete(id);
    if (!deletedExample) {
      logger.info('User not found');
      throw new NotFoundError('user not found');
    }
    return deletedExample;
  } catch (error) {
    logger.info('Error deleting user', error);
    throw new NotFoundError('user not found');
  }
};

export default {
  getAllUsers,
  createUser,
  getUsersById,
  updateUsers,
  deleteUsers,
  login,
};