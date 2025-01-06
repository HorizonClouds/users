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
    return await UsersModel.find({});
  } catch (error) {
    throw new BadRequestError('Error fetching users', error);
  }
};

export const createUser = async (data) => {
  try {
    const newExample = new UsersModel(data);
    return await newExample.save();
  } catch (error) {
    throw new BadRequestError('Error creating user', error);
  }
};

export const login = async (data, res) => {
  const { userName, password } = data;
  const user = await UsersModel.findOne({ name: userName, password: password });
  if (!user) {
      console.log('Invalid credentials, user:', user);
      return sendError(res, {
          statusCode: 401,
          message: 'Invalid credentials',
          appCode: 'UNAUTHORIZED'
      });
  }
  console.log(user.userId);
  const tokenPayload = {
    user: {
        user: user.name,
        roles: user.roles,
    }
  };
  const token = jwt.sign(tokenPayload, config.jwtSecret,{ expiresIn: '3h' });
  console.log(`User ${user.userId} authenticated successfully`);
  console.log(`Token: ${token}, secret: ${config.jwtSecret}, payload: ${JSON.stringify(tokenPayload)}`);
  return sendSuccess(res, {
      message: 'Authentication successful',
      data: { token, secret: config.jwtSecret, expiresIn: '3h', payload: tokenPayload}
  });
};

export const getUsersById = async (id) => {
  try {
    const example = await UsersModel.findById(id);
    if (!example) {
      throw new NotFoundError('user not found');
    }
    return example;
  } catch (error) {
    throw new NotFoundError('user not found');
  }
};

export const updateUsers = async (id, data) => {
  try {
    const updatedExample = await UsersModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedExample) {
      throw new NotFoundError('user not found');
    }
    return updatedExample;
  } catch (error) {
    throw new NotFoundError('user not found');
  }
};

export const deleteUsers = async (id) => {
  try {
    const deletedExample = await UsersModel.findByIdAndDelete(id);
    if (!deletedExample) {
      throw new NotFoundError('user not found');
    }
    return deletedExample;
  } catch (error) {
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
