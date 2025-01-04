import UsersModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { NotFoundError, BadRequestError } from '../utils/customErrors.js';

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

export const getUsersById = async (id) => {
  try {
    const example = await UsersModel.findById(id);
    if (!example) {
      throw new NotFoundError('user not found');
    }
    return example;
  } catch (error) {
    throw new NotFoundError('Error fetching user by ID', error);
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
    throw new NotFoundError('Error updating user', error);
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
    throw new NotFoundError('Error deleting user', error);
  }
};

export const authenticateUser = async (email, password) => {
  const user = await UsersModel.findOne({ email });
  if (!user) return null;

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  return isPasswordCorrect ? user : null;
};

export default {
  getAllUsers,
  createUser,
  getUsersById,
  updateUsers,
  deleteUsers,
  authenticateUser,
};
