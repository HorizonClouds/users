import express from 'express';
import {
  createFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  deleteFriendRequest,
} from '../controllers/friendRequestController.js';
import { friendRequestStatusValidator } from '../middlewares/friendRequestStatusValidator.js'; // Middleware para verificar el estado de la solicitud

const router = express.Router();

// Ruta para crear una nueva solicitud de amistad
router.post('/friend-request', createFriendRequest);

// Ruta para aceptar una solicitud de amistad (verificación del estado de la solicitud)
router.put('/friend-request/accept/:requestId', friendRequestStatusValidator, acceptFriendRequest);

// Ruta para rechazar una solicitud de amistad (verificación del estado de la solicitud)
router.put('/friend-request/reject/:requestId', friendRequestStatusValidator, rejectFriendRequest);

// Ruta para obtener todas las solicitudes de amistad de un usuario
router.get('/friend-requests/:userId', getFriendRequests);

// Ruta para eliminar una solicitud de amistad
router.delete('/friend-request/:requestId', deleteFriendRequest);

export default router;