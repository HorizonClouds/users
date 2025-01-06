import FriendRequestModel from '../models/friendRequestModel.js';

// Crear una solicitud de amistad
const createFriendRequest = async (requestData) => {
  const { userId, recipientUserId } = requestData;

  // Verificar si ya existe una solicitud de amistad pendiente entre estos dos usuarios
  const existingRequest = await FriendRequestModel.findOne({
    userId,
    recipientUserId,
    friendRequestStatus: 'pending',
  });

  if (existingRequest) {
    throw new Error('Ya existe una solicitud pendiente entre estos dos usuarios.');
  }

  const newFriendRequest = new FriendRequestModel({
    userId,
    recipientUserId,
    friendRequestStatus: 'pending',
  });

  await newFriendRequest.save();
  return newFriendRequest;
};

// Actualizar el estado de una solicitud de amistad
const updateFriendRequestStatus = async (requestId, status) => {
  const friendRequest = await FriendRequestModel.findById(requestId);

  if (!friendRequest) {
    throw new Error('Solicitud de amistad no encontrada');
  }

  friendRequest.friendRequestStatus = status;
  await friendRequest.save();
  return friendRequest;
};

// Obtener todas las solicitudes de amistad de un usuario
const getFriendRequests = async (userId) => {
  const friendRequests = await FriendRequestModel.find({
    $or: [{ userId }, { recipientUserId: userId }],
  });

  return friendRequests;
};

// Eliminar una solicitud de amistad
const deleteFriendRequest = async (requestId) => {
  const friendRequest = await FriendRequestModel.findById(requestId);

  if (!friendRequest) {
    throw new Error('Solicitud de amistad no encontrada');
  }

  await FriendRequestModel.deleteOne({ _id: requestId });
  return friendRequest;
};

export default {
  createFriendRequest,
  updateFriendRequestStatus,
  getFriendRequests,
  deleteFriendRequest,
};
