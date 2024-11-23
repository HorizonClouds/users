import FriendRequestModel from '../models/friendRequestModel.js';

export const friendRequestStatusValidator = async (req, res, next) => {
  const { requestId } = req.params;

  try {
    // Buscar la solicitud de amistad por ID
    const friendRequest = await friendRequestModel.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud de amistad no encontrada',
      });
    }

    if (friendRequest.friendRequestStatus === 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'La solicitud ya ha sido aceptada',
      });
    }

    if (friendRequest.friendRequestStatus === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'La solicitud ya ha sido rechazada',
      });
    }

    // Si la solicitud está pendiente, pasar al siguiente middleware
    next();
  } catch (error) {
    next(error);
  }
};


