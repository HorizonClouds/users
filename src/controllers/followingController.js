import followingModel from '../models/followingModel.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';

// Función para eliminar campos específicos de documentos MongoDB
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

// Crear un nuevo seguimiento (follow)
export const createFollowing = async (req, res, next) => {
  try {
    const { followerUserId, followedUserId } = req.body;

    // Validar que ambos IDs de usuario estén presentes
    if (!followerUserId || !followedUserId) {
      throw new ValidationError('Los IDs de usuario son requeridos', [
        { field: 'followerUserId', msg: 'Este campo es obligatorio' },
        { field: 'followedUserId', msg: 'Este campo es obligatorio' },
      ]);
    }

    // Verificar si el seguimiento ya existe
    const existingFollow = await followingModel.findOne({ followerUserId, followedUserId });
    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: 'Ya sigues a este usuario',
      });
    }

    // Crear un nuevo seguimiento
    const newFollow = new followingModel({
      followerUserId,
      followedUserId,
      followUpDate: Date.now(),
    });
    await newFollow.save();

    res.status(201).json({
      success: true,
      message: 'Seguir usuario exitosamente',
      data: removeMongoFields(newFollow),
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validación fallida',
        errors: error.errors,
      });
    }

    next(error);
  }
};

// Obtener todos los seguidores de un usuario
export const getFollowers = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Buscar los seguidores del usuario
    const followers = await followingModel.find({ followedUserId: userId });
    if (!followers || followers.length === 0) {
      throw new NotFoundError('No se encontraron seguidores para este usuario');
    }

    res.status(200).json({
      success: true,
      message: 'Seguidores obtenidos exitosamente',
      data: removeMongoFields(followers),
    });
  } catch (error) {
    res.sendError(error);
  }
};

// Obtener todos los usuarios que sigue un usuario
export const getFollowedUsers = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Buscar los usuarios que este usuario sigue
    const followedUsers = await followingModel.find({ followerUserId: userId });
    if (!followedUsers || followedUsers.length === 0) {
      throw new NotFoundError('No se encontraron usuarios que sigas');
    }

    res.status(200).json({
      success: true,
      message: 'Usuarios seguidos obtenidos exitosamente',
      data: removeMongoFields(followedUsers),
    });
  } catch (error) {
    res.sendError(error);
  }
};

// Eliminar un seguimiento (unfollow)
export const deleteFollowing = async (req, res, next) => {
  try {
    const { followerUserId, followedUserId } = req.params;

    // Buscar y eliminar el seguimiento
    const deletedFollow = await followingModel.findOneAndDelete({
      followerUserId,
      followedUserId,
    });

    if (!deletedFollow) {
      throw new NotFoundError('No se encontró el seguimiento');
    }

    res.status(200).json({
      success: true,
      message: 'Seguimiento eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

