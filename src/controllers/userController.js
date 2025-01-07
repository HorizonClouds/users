import usersService from '../services/userService.js';
import { NotFoundError, ValidationError, BadRequestError } from '../utils/customErrors.js';

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
    logger.debug('Fetching all users...');
    const examples = await usersService.getAllUsers();
    logger.debug(`Fetched ${examples.length} users.`);
    res.sendSuccess(removeMongoFields(examples));
  } catch (error) {
    logger.debug(`Error fetching users: ${error.message}`);
    res.sendError(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    logger.debug('Creating new user:', req.body);
    const newExample = await usersService.createUser(req.body);
    logger.debug('User created successfully:', newExample);
    res.sendSuccess(
      removeMongoFields(newExample),
      'User created successfully',
      201
    );
  } catch (error) {
    logger.debug(`Error creating user: ${error.message}`);
    throw new BadRequestError('Error creating user', error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    logger.debug('Received login request for user:', userName);

    // Verificar si se proporcionaron username y password
    if (!userName || !password) {
      logger.debug('Username or password missing');
      return res.status(400).json({
        status: 'error',
        message: 'Username and password are required',
      });
    }

    const loginResponse = await usersService.login(req.body, res);
    logger.debug('Login attempt completed', loginResponse);
  } catch (error) {
    logger.debug(`Error during login: ${error.message}`);
    // Manejo de errores genéricos
    next(error);
  }
};

export const getUsersById = async (req, res, next) => {
  try {
    logger.debug(`Fetching user by id: ${req.params.id}`);
    const example = await usersService.getUsersById(req.params.id);
    if (!example) throw new NotFoundError('User not found');
    logger.debug('User found:', example);
    res.sendSuccess(removeMongoFields(example));
  } catch (error) {
    logger.debug(`Error fetching user by id: ${error.message}`);
    res.sendError(error);
  }
};

export const updateUsers = async (req, res, next) => {
  try {
    let data = req.body;
    // remove _id field from data
    delete data._id;
    logger.debug('Updating user:', req.params.id, data);

    const updatedExample = await usersService.updateUsers(
      req.params.id,
      data
    );
    if (!updatedExample) throw new NotFoundError('User not found');
    logger.debug('User updated successfully:', updatedExample);
    res.sendSuccess(
      removeMongoFields(updatedExample),
      'User updated successfully'
    );
  } catch (error) {
    logger.debug(`Error updating user: ${error.message}`);
    res.sendError(error);
  }
};

export const deleteUsers = async (req, res, next) => {
  try {
    logger.debug(`Deleting user by id: ${req.params.id}`);
    const deletedExample = await usersService.deleteUsers(req.params.id);
    if (!deletedExample) throw new NotFoundError('User not found');
    logger.debug('User deleted successfully');
    res.sendSuccess(null, 'User deleted successfully', 204);
  } catch (error) {
    logger.debug(`Error deleting user: ${error.message}`);
    res.sendError(error);
  }
};

export default {
  login,
  getAllUsers,
  createUser,
  getUsersById,
  updateUsers,
  deleteUsers,
};