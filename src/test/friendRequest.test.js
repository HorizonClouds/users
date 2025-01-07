import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import FriendRequestModel from '../models/friendRequestModel.js';
import userModel from '../models/userModel.js';
import friendRequestService from '../services/friendRequestService.js';

describe('Friend Request Service', () => {
  let findOneStub;
  let findByIdStub;
  let saveStub;
  let deleteOneStub;

  beforeEach(() => {
    findOneStub = sinon.stub(userModel, 'findOne'); // Cambiado para simular la búsqueda por email
    findByIdStub = sinon.stub(FriendRequestModel, 'findById');
    saveStub = sinon.stub(FriendRequestModel.prototype, 'save');
    deleteOneStub = sinon.stub(FriendRequestModel, 'deleteOne');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createFriendRequest', () => {
    it('should create a new friend request successfully', async () => {
      const requestData = {
        userId: new mongoose.Types.ObjectId(),
        recipientEmail: 'recipient@example.com', // Cambiado a recipientEmail
      };

      // Simulamos la búsqueda del usuario receptor por email
      const mockRecipient = {
        _id: new mongoose.Types.ObjectId(),
        email: requestData.recipientEmail,
        name: 'Recipient User',
      };

      findOneStub.resolves(mockRecipient); // Simulamos que el usuario receptor existe

      saveStub.resolves({
        ...requestData,
        recipientUserId: mockRecipient._id.toString(), // Guardamos el ID del receptor
        friendRequestStatus: 'pending',
      });

      const result = await friendRequestService.createFriendRequest(requestData);

      expect(result.userId.toString()).to.equal(requestData.userId.toString());
      expect(result.recipientUserId.toString()).to.equal(mockRecipient._id.toString());
      expect(result.friendRequestStatus).to.equal('pending');
    });

    it('should throw an error if recipient user is not found', async () => {
      const requestData = {
        userId: new mongoose.Types.ObjectId(),
        recipientEmail: 'nonexistent@example.com', // Un email que no existe
      };

      findOneStub.resolves(null); // Simulamos que no se encuentra el destinatario

      try {
        await friendRequestService.createFriendRequest(requestData);
      } catch (error) {
        expect(error.message).to.equal('Recipient user not found');
      }
    });
  });

  describe('updateFriendRequestStatus', () => {
    it('should update the friend request status successfully', async () => {
      const requestId = new mongoose.Types.ObjectId();
      const status = 'accepted';

      findByIdStub.resolves({
        _id: requestId,
        friendRequestStatus: 'pending',
        save: sinon.stub().resolves({
          _id: requestId,
          friendRequestStatus: status,
        }),
      });

      const result = await friendRequestService.updateFriendRequestStatus(
        requestId,
        status
      );

      expect(result._id.toString()).to.equal(requestId.toString());
      expect(result.friendRequestStatus).to.equal(status);
    });
  });

  describe('getFriendRequests', () => {
    it('should return all friend requests for a user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockFriendRequests = [
        {
          userId,
          recipientUserId: new mongoose.Types.ObjectId(),
          friendRequestStatus: 'pending',
        },
        {
          userId: new mongoose.Types.ObjectId(),
          recipientUserId: userId,
          friendRequestStatus: 'accepted',
        },
      ];

      // Cambia `findOneStub` por `findStub`
      const findStub = sinon.stub(FriendRequestModel, 'find').resolves(mockFriendRequests);

      const result = await friendRequestService.getFriendRequests(userId.toString());

      expect(result).to.eql(mockFriendRequests);

      // Verifica que el método `find` haya sido llamado con los parámetros correctos
      expect(findStub.calledOnceWithExactly({
        recipientUserId: userId.toString(),
        friendRequestStatus: 'pending',
      })).to.be.true;

      // Restaura el stub
      findStub.restore();
    });
  });
  
  describe('deleteFriendRequest', () => {
    it('should delete the friend request successfully', async () => {
      const requestId = new mongoose.Types.ObjectId();

      findByIdStub.resolves({
        _id: requestId,
        deleteOne: deleteOneStub.resolves(),
      });

      const result = await friendRequestService.deleteFriendRequest(requestId.toString());

      expect(result._id.toString()).to.equal(requestId.toString());
    });
  });
});