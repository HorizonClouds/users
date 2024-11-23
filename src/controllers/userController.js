import usersService from '../services/userService.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';

const removeMongoFields = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => {
      const { __v, ...rest } = item.toObject();
      return rest;
    });
  } else {
    const { __v, ...rest } = data.toObject();
    return rest;
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const examples = await usersService.getAllUsers();
    res.sendSuccess(removeMongoFields(examples));
  } catch (error) {
    res.sendError(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const newExample = await usersService.createUser(req.body);
    res.sendSuccess(
      removeMongoFields(newExample),
      'User created successfully',
      201
    );
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.sendError(new ValidationError('Validation failed', error.errors));
    } else {
      res.sendError(
        new ValidationError('An error occurred while creating the user', [
          { msg: error.message },
        ])
      );
    }
  }
};

export const getUsersById = async (req, res, next) => {
  try {
    const example = await usersService.getUsersById(req.params.id);
    if (!example) throw new NotFoundError('User not found');
    res.sendSuccess(removeMongoFields(example));
  } catch (error) {
    res.sendError(error);
  }
};

export const updateUsers = async (req, res, next) => {
  try {
    let data = req.body;
    // remove _id field from data
    delete data._id;
    const updatedExample = await usersService.updateUsers(
      req.params.id,
      data
    );
    if (!updatedExample) throw new NotFoundError('User not found');
    res.sendSuccess(
      removeMongoFields(updatedExample),
      'User updated successfully'
    );
  } catch (error) {
    res.sendError(error);
  }
};

export const deleteUsers = async (req, res, next) => {
  try {
    const deletedExample = await usersService.deleteUsers(req.params.id);
    if (!deletedExample) throw new NotFoundError('User not found');
    res.sendSuccess(null, 'User deleted successfully', 204);
  } catch (error) {
    res.sendError(error);
  }
};
