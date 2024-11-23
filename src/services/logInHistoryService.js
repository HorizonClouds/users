import LoginHistory from '../models/loginHistoryModel.js'; // Importar el modelo LoginHistory
import usersService from './userService.js';
import { NotFoundError } from '../utils/customErrors.js'; // Importar errores personalizados

// Crear un nuevo registro de inicio de sesión
export const createLoginHistory = async (data) => {
  try {
    const userModel = await usersService.getUsersById(data.userId);
    if (!userModel) {
      throw new NotFoundError('User not found');
    }
    const loginHistory = new LoginHistory({
      userId: data.userId,
      loginDate: data.loginDate || Date.now(), // Si no se proporciona loginDate, se usa la fecha actual
    });

    // Guardar el registro de loginHistory en la base de datos
    await loginHistory.save();

    return loginHistory; // Devolver el registro guardado
  } catch (error) {
    throw new Error('An error occurred while creating login history');
  }
};

// Obtener todos los registros de inicio de sesión
export const getAllLoginHistory = async () => {
  try {
    // Obtener todos los registros de LoginHistory y popular los campos de 'userId'
    const loginHistory = await LoginHistory.find({});
    return loginHistory; // Devolver todos los registros de loginHistory
  } catch (error) {
    throw new Error('An error occurred while retrieving login history');
  }
};

// Obtener un registro de inicio de sesión por ID
export const getLoginHistoryById = async (id) => {
  try {
    const userModel = await usersService.getUsersById(data.userId);
    if (!userModel) {
      throw new NotFoundError('User not found');
    }
    // Buscar el registro de LoginHistory por su ID
    const loginHistory = await LoginHistory.findOne({ userId: id });
    // Si no se encuentra el registro, lanzar un error
    if (!loginHistory) {
      throw new NotFoundError('Login history not found');
    }

    return loginHistory; // Devolver el registro encontrado
  } catch (error) {
    throw error; // Propagar el error si ocurre alguno
  }
};

// Eliminar un registro de inicio de sesión por ID
export const deleteLoginHistory = async (id) => {
  try {
    // Buscar y eliminar el registro de LoginHistory por su ID
    const loginHistory = await LoginHistory.findByIdAndDelete(id);

    // Si no se encuentra el registro, lanzar un error
    if (!loginHistory) {
      throw new NotFoundError('Login history not found');
    }

    return loginHistory; // Devolver el registro eliminado
  } catch (error) {
    throw error; // Propagar el error si ocurre alguno
  }
};

export default {
  createLoginHistory,
  getAllLoginHistory,
  getLoginHistoryById,
  deleteLoginHistory,
};

