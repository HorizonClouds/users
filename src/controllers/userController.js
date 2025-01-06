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
    throw new BadRequestError('Error creating user', error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    console.log('Received login request:', userName, password);

    // Verificar si se proporcionaron username y password
    if (!userName || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username and password are required',
      });
    }

    const loginResponse = usersService.login(req.body, res);

  } catch (error) {
    // Manejo de errores genéricos
    next(error);
  }
}

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

export default {
  login,
  getAllUsers,
  createUser,
  getUsersById,
  updateUsers,
  deleteUsers,
};

