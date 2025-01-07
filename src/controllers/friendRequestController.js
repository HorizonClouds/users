import FriendRequestService from '../services/friendRequestService.js';

// Función para crear una solicitud de amistad
export const createFriendRequest = async (req, res) => {
  try {
    logger.info(`Creating friend request: ${JSON.stringify(req.body)}`);
    const friendRequest = await FriendRequestService.createFriendRequest(req.body);
    
    logger.info(`Friend request created successfully: ${JSON.stringify(friendRequest)}`);
    res.status(201).json({
      status: 'success',
      message: 'Solicitud de amistad creada correctamente',
      data: friendRequest,
    });
  } catch (error) {
    logger.info(`Error in creating friend request: ${error.message}`);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Función para aceptar una solicitud de amistad
export const acceptFriendRequest = async (req, res) => {
  try {
    logger.info(`Accepting friend request with requestId=${req.params.requestId}`);
    const updatedRequest = await FriendRequestService.updateFriendRequestStatus(req.params.requestId, 'accepted');
    
    logger.info(`Friend request accepted successfully: ${JSON.stringify(updatedRequest)}`);
    res.status(200).json({
      status: 'success',
      message: 'Solicitud de amistad aceptada correctamente',
      data: updatedRequest,
    });
  } catch (error) {
    logger.info(`Error in accepting friend request: ${error.message}`);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Función para rechazar una solicitud de amistad
export const rejectFriendRequest = async (req, res) => {
  try {
    logger.info(`Rejecting friend request with requestId=${req.params.requestId}`);
    const updatedRequest = await FriendRequestService.updateFriendRequestStatus(req.params.requestId, 'rejected');
    
    logger.info(`Friend request rejected successfully: ${JSON.stringify(updatedRequest)}`);
    res.status(200).json({
      status: 'success',
      message: 'Solicitud de amistad rechazada correctamente',
      data: updatedRequest,
    });
  } catch (error) {
    logger.info(`Error in rejecting friend request: ${error.message}`);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Función para obtener todas las solicitudes de amistad de un usuario
export const getFriendRequests = async (req, res) => {
  try {
    logger.info(`Fetching friend requests for userId=${req.params.userId}`);
    const friendRequests = await FriendRequestService.getFriendRequests(req.params.userId);
    
    logger.info(`Friend requests fetched successfully: ${JSON.stringify(friendRequests)}`);
    res.status(200).json({
      status: 'success',
      message: 'Solicitudes de amistad obtenidas correctamente',
      data: friendRequests,
    });
  } catch (error) {
    logger.info(`Error in fetching friend requests: ${error.message}`);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Función para eliminar una solicitud de amistad
export const deleteFriendRequest = async (req, res) => {
  try {
    logger.info(`Deleting friend request with requestId=${req.params.requestId}`);
    const deletedRequest = await FriendRequestService.deleteFriendRequest(req.params.requestId);
    
    logger.info(`Friend request deleted successfully: ${JSON.stringify(deletedRequest)}`);
    res.status(200).json({
      status: 'success',
      message: 'Solicitud de amistad eliminada correctamente',
      data: deletedRequest,
    });
  } catch (error) {
    logger.info(`Error in deleting friend request: ${error.message}`);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};