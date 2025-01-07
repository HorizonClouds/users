import loginService from '../services/logInHistoryService.js'; // Importar el modelo LoginHistory
import { NotFoundError, ValidationError } from '../utils/customErrors.js'; // Importar errores personalizados

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

// Crear un nuevo registro de inicio de sesión
export const createLoginHistory = async (req, res, next) => {
  try {
    logger.debug(`Creating login history with data: ${JSON.stringify(req.body)}`);
    const newExample = await loginService.createLoginHistory(req.body);
    
    logger.debug(`Login history created successfully: ${JSON.stringify(newExample)}`);
    res.sendSuccess(
      removeMongoFields(newExample),
      'Login created successfully',
      201
    );
  } catch (error) {
    logger.debug(`Error in creating login history: ${error.message}`);
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating login history' });
  }
};

// Obtener todo el historial de inicio de sesión
export const getAllLoginHistory = async (req, res, next) => {
  try {
    logger.debug('Fetching all login history');
    // Obtener todos los registros de loginHistory
    const example = await loginService.getAllLoginHistory();
    
    logger.debug(`Login history retrieved successfully: ${JSON.stringify(example)}`);
    res.sendSuccess(removeMongoFields(example));
  } catch (error) {
    logger.debug(`Error in retrieving all login history: ${error.message}`);
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving login history' });
  }
};

// Obtener un registro de inicio de sesión por ID
export const getLoginHistoryById = async (req, res, next) => {
  try {
    logger.debug(`Fetching login history for id=${req.params.id}`);
    const example = await loginService.getLoginHistoryById(req.params.id);
    if (!example) throw new NotFoundError('History not found');
    
    logger.debug(`Login history found: ${JSON.stringify(example)}`);
    res.sendSuccess(removeMongoFields(example));
  } catch (error) {
    logger.debug(`Error in fetching login history by ID: ${error.message}`);
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
    logger.debug(`Deleting login history for id=${req.params.id}`);
    const deletedExample = await loginService.deleteLoginHistory(req.params.id);
    if (!deletedExample) throw new NotFoundError('login history not found');
    
    logger.debug(`Login history deleted successfully: ${JSON.stringify(deletedExample)}`);
    res.sendSuccess(null, 'login history deleted successfully', 204);
  } catch (error) {
    logger.debug(`Error in deleting login history: ${error.message}`);
    console.error(error);
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An error occurred while deleting login history' });
    }
  }
};