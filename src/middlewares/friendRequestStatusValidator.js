import FriendRequestModel from '../models/friendRequestModel.js';

export const friendRequestStatusValidator = async (req, res, next) => {
  const { requestId } = req.params;

  try {
    logger.info(`Validando estado de la solicitud de amistad con ID: ${requestId}`);
    
    // Buscar la solicitud de amistad por ID
    const friendRequest = await FriendRequestModel.findById(requestId);

    if (!friendRequest) {
      logger.info(`Solicitud de amistad con ID ${requestId} no encontrada`);
      return res.status(404).json({
        success: false,
        message: 'Solicitud de amistad no encontrada',
      });
    }

    // Verificar el estado de la solicitud de amistad
    if (friendRequest.friendRequestStatus === 'accepted') {
      logger.info(`La solicitud con ID ${requestId} ya ha sido aceptada`);
      return res.status(400).json({
        success: false,
        message: 'La solicitud ya ha sido aceptada',
      });
    }

    if (friendRequest.friendRequestStatus === 'rejected') {
      logger.info(`La solicitud con ID ${requestId} ya ha sido rechazada`);
      return res.status(400).json({
        success: false,
        message: 'La solicitud ya ha sido rechazada',
      });
    }

    // Si la solicitud está pendiente, pasar al siguiente middleware
    logger.info(`La solicitud con ID ${requestId} está pendiente, continuando...`);
    next();
  } catch (error) {
    logger.error(`Error al validar la solicitud de amistad con ID ${requestId}: ${error.message}`);
    next(error);
  }
};