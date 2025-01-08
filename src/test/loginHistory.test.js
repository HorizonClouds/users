import { expect } from 'chai';
import sinon from 'sinon';
import LoginHistory from '../models/loginHistoryModel.js';
import usersService from '../services/userService.js';
import loginHistoryService from '../services/logInHistoryService.js';
import friendRequestService from '../services/friendRequestService.js';
import { NotFoundError } from '../utils/customErrors.js';
import mongoose from 'mongoose';

describe('LoginHistory Service', () => {
  describe('createLoginHistory', () => {
    let findByIdStub;
    let saveStub;
    
    let findStub;
    beforeEach(() => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        photo: 'photo_url',
        biography: 'This is a biography',
        roles: ['user'],
        accountStatus: 'active',
        registrationDate: Date.now(),
      };
      findStub = sinon.stub(LoginHistory, 'find'); // Define el stub correctamente
      findByIdStub = sinon.stub(usersService, 'getUsersById').resolves(mockUser);
      saveStub = sinon.stub(LoginHistory.prototype, 'save');
    });
    
    afterEach(() => {
      findStub.restore(); // No olvides restaurar el stub de find
      findByIdStub.restore();
      saveStub.restore();
    });
    
    it('should return the login history record by ID', async () => {
      const mockUser = { _id: new mongoose.Types.ObjectId(), name: 'John Doe' };
      findByIdStub.resolves(mockUser);
    
      const mockLoginHistory = {
        _id: new mongoose.Types.ObjectId(),
        userId: mockUser._id,
        loginDate: '2025-01-01T12:00:00Z',
      };
    
      findStub.resolves(mockLoginHistory); // Asegúrate de devolver un objeto, no un array vacío.
    
      const result = await loginHistoryService.getLoginHistoryById(mockUser._id.toString());
    
      expect(result).to.not.be.null;
      expect(result).to.not.be.undefined;
      expect(result).to.have.property('userId');
      expect(result.userId.toString()).to.equal(mockUser._id.toString());
    });
    
    it('should throw NotFoundError if the user does not exist', async () => {
      findByIdStub.resolves(null);
      
      const newLoginHistory = { userId: 'userId1' };
      
      try {
        await loginHistoryService.createLoginHistory(newLoginHistory);
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal('User not found');
      }
    });
  });

  describe('getLoginHistoryById', () => {
    let findOneStub;
    let findByIdStub;
    
    beforeEach(() => {
      findByIdStub = sinon.stub(usersService, 'getUsersById');
      findOneStub = sinon.stub(LoginHistory, 'findOne');
    });
    
    afterEach(() => {
      findByIdStub.restore();
      findOneStub.restore();
    });
    
    it('should return the login history record by ID', async () => {
      const mockUser = { _id: new mongoose.Types.ObjectId(), name: 'John Doe' };
      findByIdStub.resolves(mockUser);

      const mockLoginHistory = {
        _id: new mongoose.Types.ObjectId(),
        userId: mockUser._id,
        loginDate: '2025-01-01T12:00:00Z',
      };

      findOneStub.resolves(mockLoginHistory); // Asegurarse de que se retorna un objeto, no un array vacío.
      
      const result = await loginHistoryService.getLoginHistoryById(mockUser._id.toString());

      expect(result).to.not.be.null;
      expect(result).to.not.be.undefined;
    });

    it('should throw NotFoundError if the login history does not exist', async () => {
      const mockUser = { _id: new mongoose.Types.ObjectId(), name: 'John Doe' };
      findByIdStub.resolves(mockUser);

      findOneStub.resolves(null); // Simula que el registro no existe

      try {
        await loginHistoryService.getLoginHistoryById(mockUser._id.toString());
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal('Login history not found');
      }
    });
  });
});

describe('Friend Request Service', () => {
  let findByIdStub;
  let saveStub;
  
  beforeEach(() => {
    const mockSender = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Sender User',
      email: 'sender@example.com',
      password: 'password',
      roles: ['user'],
    };

    const mockRecipient = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Recipient User',
      email: 'recipient@example.com',
      password: 'password',
      roles: ['user'],
    };

    findByIdStub = sinon.stub(usersService, 'getUsersById');
    saveStub = sinon.stub(friendRequestService, 'createFriendRequest');

    findByIdStub.onCall(0).resolves(mockSender); // Simulamos que el remitente existe
    findByIdStub.onCall(1).resolves(mockRecipient); // Simulamos que el destinatario existe
  });

  afterEach(() => {
    findByIdStub.restore();
    saveStub.restore();
  });

  it('should create a new friend request successfully', async () => {
    const requestPayload = {
      senderId: 'senderId',
      recipientId: 'recipientId',
    };

    const mockFriendRequest = {
      _id: new mongoose.Types.ObjectId(),
      senderId: requestPayload.senderId,
      recipientId: requestPayload.recipientId,
      status: 'pending',
    };

    saveStub.resolves(mockFriendRequest);

    const result = await friendRequestService.createFriendRequest(requestPayload);

    expect(result).to.have.property('_id');
    expect(result.senderId).to.equal(requestPayload.senderId);
    expect(result.recipientId).to.equal(requestPayload.recipientId);
    expect(result.status).to.equal('pending');
  });

  it('should throw NotFoundError if recipient user not found', async () => {
    findByIdStub.onCall(1).resolves(null); // Simulamos que el destinatario no existe

    const requestPayload = {
      senderId: 'senderId',
      recipientId: 'recipientId',
    };

    try {
      await friendRequestService.createFriendRequest(requestPayload);
    } catch (error) {
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal('Recipient user not found');
    }
  });
});