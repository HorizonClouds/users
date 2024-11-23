import FriendRequestService from '../services/friendRequestService.js';

// Función para crear una solicitud de amistad
export const createFriendRequest = async (req, res) => {
  try {
    const friendRequest = await FriendRequestService.createFriendRequest(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Solicitud de amistad creada correctamente',
      data: friendRequest,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Función para aceptar una solicitud de amistad
export const acceptFriendRequest = async (req, res) => {
  try {
    const updatedRequest = await FriendRequestService.updateFriendRequestStatus(req.params.requestId, 'accepted');
    res.status(200).json({
      status: 'success',
      message: 'Solicitud de amistad aceptada correctamente',
      data: updatedRequest,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Función para rechazar una solicitud de amistad
export const rejectFriendRequest = async (req, res) => {
  try {
    const updatedRequest = await FriendRequestService.updateFriendRequestStatus(req.params.requestId, 'rejected');
    res.status(200).json({
      status: 'success',
      message: 'Solicitud de amistad rechazada correctamente',
      data: updatedRequest,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Función para obtener todas las solicitudes de amistad de un usuario
export const getFriendRequests = async (req, res) => {
  try {
    const friendRequests = await FriendRequestService.getFriendRequests(req.params.userId);
    res.status(200).json({
      status: 'success',
      message: 'Solicitudes de amistad obtenidas correctamente',
      data: friendRequests,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Función para eliminar una solicitud de amistad
export const deleteFriendRequest = async (req, res) => {
  try {
    const deletedRequest = await FriendRequestService.deleteFriendRequest(req.params.requestId);
    res.status(200).json({
      status: 'success',
      message: 'Solicitud de amistad eliminada correctamente',
      data: deletedRequest,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
