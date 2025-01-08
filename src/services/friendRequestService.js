import FriendRequestModel from '../models/friendRequestModel.js';
import userModel from '../models/userModel.js';
import { sendNotificationToKafka } from '../utils/notificationProducer.js';

// Crear una solicitud de amistad
const createFriendRequest = async (requestData) => {
  const { userId, recipientUserId: recipientEmail } = requestData; // Renombrar recipientUserId a recipientEmail

  const user1 = await userModel.findById(userId);

  // Buscar el usuario por email
  const userRecipient = await userModel.findOne({
    email: recipientEmail,
  });

  if (!userRecipient) {
    throw new Error('Recipient user not found'); // Manejar el caso de que el usuario no exista
  }

  // Extraer el ID del usuario encontrado
  const recipientUserId = userRecipient._id.toString(); // Convertir el ObjectId a string

  logger.info('Recipient userId:', recipientUserId);

  logger.info('Creating friend request:', { userId, recipientUserId });

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

  try {
    const transformedNotification = {
      userId: userId,
      config: {
        email: true,
      },
      type: "message",
      resourceId: newFriendRequest._id, 
      notificationStatus: 'NOT SEEN',  
    };
    await sendNotificationToKafka(transformedNotification);
  } catch (error) {
    logger.info('Error al enviar a notifications ', error);
  }
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
    friendRequestStatus: 'pending', // Agregar condiciÃ³n para estado pendiente
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