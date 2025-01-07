import FriendRequestService from '../services/friendRequestService.js';

// Función para crear una solicitud de amistad
export const createFriendRequest = async (req, res) => {
  try {
    logger.debug(`Creating friend request: ${JSON.stringify(req.body)}`);
    const friendRequest = await FriendRequestService.createFriendRequest(req.body);
    
    logger.debug(`Friend request created successfully: ${JSON.stringify(friendRequest)}`);
    res.status(201).json({
      status: 'success',
      message: 'Solicitud de amistad creada correctamente',
      data: friendRequest,
    });
  } catch (error) {
    logger.debug(`Error in creating friend request: ${error.message}`);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Función para aceptar una solicitud de amistad
export const acceptFriendRequest = async (req, res) => {
  try {
    logger.debug(`Accepting friend request with requestId=${req.params.requestId}`);
    const updatedRequest = await FriendRequestService.updateFriendRequestStatus(req.params.requestId, 'accepted');
    
    logger.debug(`Friend request accepted successfully: ${JSON.stringify(updatedRequest)}`);
    res.status(200).json({
      status: 'success',
      message: 'Solicitud de amistad aceptada correctamente',
      data: updatedRequest,
    });
  } catch (error) {
    logger.debug(`Error in accepting friend request: ${error.message}`);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Función para rechazar una solicitud de amistad
export const rejectFriendRequest = async (req, res) => {
  try {
    logger.debug(`Rejecting friend request with requestId=${req.params.requestId}`);
    const updatedRequest = await FriendRequestService.updateFriendRequestStatus(req.params.requestId, 'rejected');
    
    logger.debug(`Friend request rejected successfully: ${JSON.stringify(updatedRequest)}`);
    res.status(200).json({
      status: 'success',
      message: 'Solicitud de amistad rechazada correctamente',
      data: updatedRequest,
    });
  } catch (error) {
    logger.debug(`Error in rejecting friend request: ${error.message}`);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Función para obtener todas las solicitudes de amistad de un usuario
export const getFriendRequests = async (req, res) => {
  try {
    logger.debug(`Fetching friend requests for userId=${req.params.userId}`);
    const friendRequests = await FriendRequestService.getFriendRequests(req.params.userId);
    
    logger.debug(`Friend requests fetched successfully: ${JSON.stringify(friendRequests)}`);
    res.status(200).json({
      status: 'success',
      message: 'Solicitudes de amistad obtenidas correctamente',
      data: friendRequests,
    });
  } catch (error) {
    logger.debug(`Error in fetching friend requests: ${error.message}`);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Función para eliminar una solicitud de amistad
export const deleteFriendRequest = async (req, res) => {
  try {
    logger.debug(`Deleting friend request with requestId=${req.params.requestId}`);
    const deletedRequest = await FriendRequestService.deleteFriendRequest(req.params.requestId);
    
    logger.debug(`Friend request deleted successfully: ${JSON.stringify(deletedRequest)}`);
    res.status(200).json({
      status: 'success',
      message: 'Solicitud de amistad eliminada correctamente',
      data: deletedRequest,
    });
  } catch (error) {
    logger.debug(`Error in deleting friend request: ${error.message}`);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};