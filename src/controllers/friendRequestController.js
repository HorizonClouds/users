import FriendRequestModel from '../models/friendRequestModel.js';
import { ValidationError } from '../utils/customErrors.js';

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

// Crear una nueva solicitud de amistad
export const createFriendRequest = async (req, res, next) => {
  try {
    const { userId, recipientUserId } = req.body;

    // Validar que los IDs estén presentes
    if (!userId || !recipientUserId) {
      throw new ValidationError('Ambos IDs de usuario son requeridos', [
        { field: 'userId', msg: 'Este campo es obligatorio' },
        { field: 'recipientUserId', msg: 'Este campo es obligatorio' },
      ]);
    }

    // Comprobar si ya existe una solicitud pendiente entre los usuarios
    const existingRequest = await FriendRequestModel.findOne({
      userId,
      recipientUserId,
      friendRequestStatus: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una solicitud pendiente entre estos usuarios',
      });
    }

    // Crear una nueva solicitud de amistad
    const newRequest = new FriendRequestModel({
      userId,
      recipientUserId,
      friendRequestStatus: 'pending',
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: 'Solicitud de amistad enviada con éxito',
      data: removeMongoFields(newRequest),
    });
  } catch (error) {
    next(error);
  }
};

// Aceptar una solicitud de amistad
export const acceptFriendRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    // Buscar la solicitud de amistad
    const friendRequest = await FriendRequestModel.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud de amistad no encontrada',
      });
    }

    // Cambiar el estado de la solicitud a 'accepted'
    friendRequest.friendRequestStatus = 'accepted';
    await friendRequest.save();

    res.status(200).json({
      success: true,
      message: 'Solicitud de amistad aceptada con éxito',
      data: removeMongoFields(friendRequest),
    });
  } catch (error) {
    next(error);
  }
};

// Rechazar una solicitud de amistad
export const rejectFriendRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    // Buscar la solicitud de amistad
    const friendRequest = await FriendRequestModel.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud de amistad no encontrada',
      });
    }

    // Cambiar el estado de la solicitud a 'rejected'
    friendRequest.friendRequestStatus = 'rejected';
    await friendRequest.save();

    res.status(200).json({
      success: true,
      message: 'Solicitud de amistad rechazada con éxito',
      data: removeMongoFields(friendRequest),
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todas las solicitudes de amistad de un usuario
export const getFriendRequests = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Obtener las solicitudes pendientes o aceptadas para un usuario
    const requests = await FriendRequestModel.find({
      $or: [{ userId }, { recipientUserId: userId }],
      friendRequestStatus: { $in: ['pending', 'accepted'] },
    });

    if (!requests.length) {
      return res.status(404).json({
        success: false,
        message: 'No hay solicitudes de amistad para este usuario',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Solicitudes de amistad obtenidas con éxito',
      data: removeMongoFields(requests),
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una solicitud de amistad
export const deleteFriendRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    // Buscar y eliminar la solicitud de amistad
    const deletedRequest = await FriendRequestModel.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud de amistad no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Solicitud de amistad eliminada con éxito',
    });
  } catch (error) {
    next(error);
  }

  
};


