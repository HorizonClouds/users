import FriendRequestModel from '../models/friendRequestModel.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';

// Función para crear una nueva solicitud de amistad
export const createFriendRequest = async (userId, recipientUserId) => {
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
    throw new ValidationError('Ya existe una solicitud pendiente entre estos usuarios');
  }

  // Crear una nueva solicitud de amistad
  const newRequest = new FriendRequestModel({
    userId,
    recipientUserId,
    friendRequestStatus: 'pending',
  });

  await newRequest.save();
  return newRequest;
};

// Aceptar una solicitud de amistad
export const acceptFriendRequest = async (requestId) => {
  // Buscar la solicitud de amistad
  const friendRequest = await FriendRequestModel.findById(requestId);
  if (!friendRequest) {
    throw new NotFoundError('Solicitud de amistad no encontrada');
  }

  // Cambiar el estado de la solicitud a 'accepted'
  friendRequest.friendRequestStatus = 'accepted';
  await friendRequest.save();
  return friendRequest;
};

// Rechazar una solicitud de amistad
export const rejectFriendRequest = async (requestId) => {
  // Buscar la solicitud de amistad
  const friendRequest = await FriendRequestModel.findById(requestId);
  if (!friendRequest) {
    throw new NotFoundError('Solicitud de amistad no encontrada');
  }

  // Cambiar el estado de la solicitud a 'rejected'
  friendRequest.friendRequestStatus = 'rejected';
  await friendRequest.save();
  return friendRequest;
};

// Obtener todas las solicitudes de amistad de un usuario
export const getFriendRequests = async (userId) => {
  // Obtener las solicitudes pendientes o aceptadas para un usuario
  const requests = await FriendRequestModel.find({
    $or: [{ userId }, { recipientUserId: userId }],
    friendRequestStatus: { $in: ['pending', 'accepted'] },
  });

  if (!requests.length) {
    throw new NotFoundError('No hay solicitudes de amistad para este usuario');
  }

  return requests;
};

// Eliminar una solicitud de amistad
export const deleteFriendRequest = async (requestId) => {
  // Buscar y eliminar la solicitud de amistad
  const deletedRequest = await FriendRequestModel.findByIdAndDelete(requestId);
  if (!deletedRequest) {
    throw new NotFoundError('Solicitud de amistad no encontrada');
  }

  return deletedRequest;
};
