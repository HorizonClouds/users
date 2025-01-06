import { expect } from 'chai';
import sinon from 'sinon';
import FriendRequestModel from '../models/friendRequestModel.js';
import friendRequestService from '../services/friendRequestService.js';

describe('Friend Request Service', () => {
  let findOneStub;
  let findByIdStub;
  let saveStub;
  let removeStub;

  beforeEach(() => {
    // Crea los stubs para los métodos de FriendRequestModel
    findOneStub = sinon.stub(FriendRequestModel, 'findOne');
    findByIdStub = sinon.stub(FriendRequestModel, 'findById');
    saveStub = sinon.stub(FriendRequestModel.prototype, 'save');
    removeStub = sinon.stub(FriendRequestModel.prototype, 'deleteOne');
  });

  afterEach(() => {
    // Restaura todos los stubs después de cada prueba
    sinon.restore();
  });

  describe('createFriendRequest', () => {
    /*it('should create a new friend request successfully', async () => {
      const requestData = { userId: 'userId1', recipientUserId: 'userId2' };

      // Simula que no existe una solicitud pendiente
      findOneStub.resolves(null);

      // Simula el guardado de la solicitud de amistad
      saveStub.resolves(requestData);

      const result = await friendRequestService.createFriendRequest(requestData);

      expect(result.userId).to.equal(requestData.userId);
      expect(result.recipientUserId).to.equal(requestData.recipientUserId);
      expect(result.friendRequestStatus).to.equal('pending');
    });*/

    it('should throw error if a pending friend request already exists', async () => {
      const requestData = { userId: 'userId1', recipientUserId: 'userId2' };

      // Simula que ya existe una solicitud pendiente entre los dos usuarios
      findOneStub.resolves({ userId: 'userId1', recipientUserId: 'userId2' });

      try {
        await friendRequestService.createFriendRequest(requestData);
      } catch (err) {
        expect(err.message).to.equal('Ya existe una solicitud pendiente entre estos dos usuarios.');
      }
    });
  });

  describe('updateFriendRequestStatus', () => {
    /*it('should update the friend request status successfully', async () => {
      const requestId = 'requestId123';
      const status = 'accepted';

      // Simula que se encuentra la solicitud de amistad
      findByIdStub.resolves({ _id: requestId, friendRequestStatus: 'pending' });

      // Simula el guardado de la solicitud con el nuevo estado
      saveStub.resolves({ _id: requestId, friendRequestStatus: status });

      const result = await friendRequestService.updateFriendRequestStatus(requestId, status);

      expect(result._id).to.equal(requestId);
      expect(result.friendRequestStatus).to.equal(status);
    }); */

    it('should throw error if friend request is not found', async () => {
      const requestId = 'nonExistingRequestId';
      const status = 'accepted';

      // Simula que no se encuentra la solicitud
      findByIdStub.resolves(null);

      try {
        await friendRequestService.updateFriendRequestStatus(requestId, status);
      } catch (err) {
        expect(err.message).to.equal('Solicitud de amistad no encontrada');
      }
    });
  });

  /*describe('getFriendRequests', () => {
    it('should return all friend requests for a user', async () => {
      const userId = 'userId1';
      const mockFriendRequests = [
        { userId: 'userId1', recipientUserId: 'userId2', friendRequestStatus: 'pending' },
        { userId: 'userId2', recipientUserId: 'userId1', friendRequestStatus: 'accepted' },
      ];

      // Simula que se encuentran solicitudes de amistad
      findOneStub.resolves(mockFriendRequests);

      const result = await friendRequestService.getFriendRequests(userId);

      expect(result).to.eql(mockFriendRequests);
    });
  });*/

  describe('deleteFriendRequest', () => {
    /*it('should delete the friend request successfully', async () => {
      const requestId = 'requestId123';
      const mockFriendRequest = { _id: requestId, friendRequestStatus: 'pending' };

      // Simula que se encuentra la solicitud de amistad
      findByIdStub.resolves(mockFriendRequest);

      // Simula la eliminación de la solicitud
      removeStub.resolves(mockFriendRequest);

      const result = await friendRequestService.deleteFriendRequest(requestId);

      expect(result._id).to.equal(requestId);
    });*/

    it('should throw error if friend request is not found', async () => {
      const requestId = 'nonExistingRequestId';

      // Simula que no se encuentra la solicitud
      findByIdStub.resolves(null);

      try {
        await friendRequestService.deleteFriendRequest(requestId);
      } catch (err) {
        expect(err.message).to.equal('Solicitud de amistad no encontrada');
      }
    });
  });
});
