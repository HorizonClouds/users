import FriendRequestModel from '../models/friendRequestModel.js';

// Crear una solicitud de amistad
const createFriendRequest = async (requestData) => {
  const { userId, recipientUserId } = requestData;

  logger.info('Creating friend request:', requestData);

  // Verificar si ya existe una solicitud de amistad pendiente entre estos dos usuarios
  const existingRequest = await FriendRequestModel.findOne({
    userId,
    recipientUserId,
    friendRequestStatus: 'pending',
  });

  if (existingRequest) {
    logger.info('Pending friend request already exists between these users.');
    throw new Error('Ya existe una solicitud pendiente entre estos dos usuarios.');
  }

  const newFriendRequest = new FriendRequestModel({
    userId,
    recipientUserId,
    friendRequestStatus: 'pending',
  });

  await newFriendRequest.save();
  logger.info('Friend request created successfully:', newFriendRequest);
  return newFriendRequest;
};

// Actualizar el estado de una solicitud de amistad
const updateFriendRequestStatus = async (requestId, status) => {
  logger.info('Updating friend request status:', requestId, 'New status:', status);

  const friendRequest = await FriendRequestModel.findById(requestId);

  if (!friendRequest) {
    logger.info('Friend request not found:', requestId);
    throw new Error('Solicitud de amistad no encontrada');
  }

  friendRequest.friendRequestStatus = status;
  await friendRequest.save();
  logger.info('Friend request status updated:', friendRequest);
  return friendRequest;
};

// Obtener todas las solicitudes de amistad de un usuario
const getFriendRequests = async (userId) => {
  logger.info('Getting friend requests for user:', userId);

  const friendRequests = await FriendRequestModel.find({
    recipientUserId: userId,
    friendRequestStatus: 'pending', // Agregar condición para estado pendiente
  });
  logger.info('Friend requests found:', friendRequests);
  return friendRequests;
};

// Eliminar una solicitud de amistad
const deleteFriendRequest = async (requestId) => {
  logger.info('Deleting friend request:', requestId);

  const friendRequest = await FriendRequestModel.findById(requestId);

  if (!friendRequest) {
    logger.info('Friend request not found for deletion:', requestId);
    throw new Error('Solicitud de amistad no encontrada');
  }

  await FriendRequestModel.deleteOne({ _id: requestId });
  logger.info('Friend request deleted:', requestId);
  return friendRequest;
};

export default {
  createFriendRequest,
  updateFriendRequestStatus,
  getFriendRequests,
  deleteFriendRequest,
};