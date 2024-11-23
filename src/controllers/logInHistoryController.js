import LoginHistory from '../models/loginHistoryModel.js'; // Importar el modelo LoginHistory
import { NotFoundError } from '../utils/customErrors.js'; // Importar errores personalizados

// Crear un nuevo registro de inicio de sesión
export const createLoginHistory = async (req, res, next) => {
  try {
    const { userId, loginDate } = req.body;

    // Crear el nuevo registro de inicio de sesión
    const loginHistory = new LoginHistory({
      userId,
      loginDate: loginDate || Date.now(), // Si no se proporciona loginDate, se usa la fecha actual
    });

    // Guardar el registro en la base de datos
    await loginHistory.save();

    // Responder con el registro creado
    res.status(201).json({
      message: 'Login history created successfully',
      data: loginHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating login history' });
  }
};

// Obtener todo el historial de inicio de sesión
export const getAllLoginHistory = async (req, res, next) => {
  try {
    // Obtener todos los registros de loginHistory
    const loginHistory = await LoginHistory.find().populate('userId', 'name email');

    // Responder con el historial de inicio de sesión
    res.status(200).json({
      message: 'Login history retrieved successfully',
      data: loginHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving login history' });
  }
};

// Obtener un registro de inicio de sesión por ID
export const getLoginHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar el registro de loginHistory por ID
    const loginHistory = await LoginHistory.findById(id).populate('userId', 'name email');
    
    // Si no se encuentra el registro, lanzar un error
    if (!loginHistory) {
      throw new NotFoundError('Login history not found');
    }

    // Responder con el registro de loginHistory
    res.status(200).json({
      message: 'Login history retrieved successfully',
      data: loginHistory,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An error occurred while retrieving login history' });
    }
  }
};

// Eliminar un registro de inicio de sesión por ID
export const deleteLoginHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar y eliminar el registro de loginHistory por ID
    const loginHistory = await LoginHistory.findByIdAndDelete(id);
    
    // Si no se encuentra el registro, lanzar un error
    if (!loginHistory) {
      throw new NotFoundError('Login history not found');
    }

    // Responder con éxito
    res.status(204).json({
      message: 'Login history deleted successfully',
    });
  } catch (error) {
    console.error(error);
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An error occurred while deleting login history' });
    }
  }
};
