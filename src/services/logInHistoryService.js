import LoginHistory from '../models/loginHistoryModel.js'; // Importar el modelo LoginHistory
import usersService from './userService.js';
import { NotFoundError } from '../utils/customErrors.js'; // Importar errores personalizados

// Crear un nuevo registro de inicio de sesión
export const createLoginHistory = async (data) => {
  try {
    logger.debug('Creating login history for userId:', data.userId);
    logger.debug('Login data:', data);

    const userModel = await usersService.getUsersById(data.userId);
    if (!userModel) {
      logger.debug('User not found');
      throw new NotFoundError('User not found');
    }
    logger.debug('User found:', userModel);

    const loginHistory = new LoginHistory({
      userId: data.userId,
      loginDate: data.loginDate || Date.now(), // Si no se proporciona loginDate, se usa la fecha actual
    });

    // Guardar el registro de loginHistory en la base de datos
    logger.debug('loginHistory object:', loginHistory);
    await loginHistory.save();

    logger.debug('loginHistory saved successfully');
    return loginHistory; // Devolver el registro guardado
  } catch (error) {
    logger.debug('Error creating login history:', error);
    throw error;
  }
};

// Obtener todos los registros de inicio de sesión
export const getAllLoginHistory = async () => {
  try {
    logger.debug('Retrieving all login history records');

    // Obtener todos los registros de LoginHistory y popular los campos de 'userId'
    const loginHistory = await LoginHistory.find({});
    logger.debug('Retrieved login history:', loginHistory);

    return loginHistory; // Devolver todos los registros de loginHistory
  } catch (error) {
    logger.debug('Error retrieving login history:', error);
    throw new Error('An error occurred while retrieving login history');
  }
};

// Obtener un registro de inicio de sesión por ID
export const getLoginHistoryById = async (id) => {
  try {
    logger.debug('Getting login history for userId:', id);

    const userModel = await usersService.getUsersById(id);
    if (!userModel) {
      logger.debug('User not found');
      throw new NotFoundError('User not found');
    }

    // Buscar el registro de LoginHistory por su ID
    const loginHistory = await LoginHistory.findOne({ userId: id });
    // Si no se encuentra el registro, lanzar un error
    if (!loginHistory) {
      logger.debug('Login history not found');
      throw new NotFoundError('Login history not found');
    }

    logger.debug('Login history found:', loginHistory);
    return loginHistory; // Devolver el registro encontrado
  } catch (error) {
    logger.debug('Error getting login history by ID:', error);
    throw error; // Propagar el error si ocurre alguno
  }
};

// Eliminar un registro de inicio de sesión por ID
export const deleteLoginHistory = async (id) => {
  try {
    logger.debug('Deleting login history for userId:', id);

    // Buscar y eliminar el registro de LoginHistory por su ID
    const loginHistory = await LoginHistory.findByIdAndDelete(id);

    // Si no se encuentra el registro, lanzar un error
    if (!loginHistory) {
      logger.debug('Login history not found');
      throw new NotFoundError('Login history not found');
    }

    logger.debug('Login history deleted successfully:', loginHistory);
    return loginHistory; // Devolver el registro eliminado
  } catch (error) {
    logger.debug('Error deleting login history:', error);
    throw error; // Propagar el error si ocurre alguno
  }
};

export default {
  createLoginHistory,
  getAllLoginHistory,
  getLoginHistoryById,
  deleteLoginHistory,
};