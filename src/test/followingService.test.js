import { expect } from 'chai';
import sinon from 'sinon';
import * as followingService from '../services/followingService.js';
import followingModel from '../models/followingModel.js';

describe('Following Service', () => {
  // Stubs para los métodos de followingModel
  let findOneStub;
  let findStub;
  let createStub;
  let findOneAndDeleteStub;

  beforeEach(() => {
    // Inicializa los stubs
    findOneStub = sinon.stub(followingModel, 'findOne');
    findStub = sinon.stub(followingModel, 'find');
    createStub = sinon.stub(followingModel.prototype, 'save');
    findOneAndDeleteStub = sinon.stub(followingModel, 'findOneAndDelete');
  });

  afterEach(() => {
    // Restaurar los stubs después de cada prueba
    sinon.restore();
  });

  describe('createFollowing', () => {
    it('should create a new following successfully', async () => {
      const followerUserId = 'follower123';
      const followedUserId = 'followed123';

      // Simula que no existe un seguimiento previo
      findOneStub.resolves(null);

      // Simula la creación del seguimiento
      createStub.resolves({ followerUserId, followedUserId });

      const result = await followingService.createFollowing(followerUserId, followedUserId);

      expect(result).to.eql({ followerUserId, followedUserId }); // Verifica que el seguimiento se haya creado correctamente
    });

    it('should throw error if following already exists', async () => {
      const followerUserId = 'follower123';
      const followedUserId = 'followed123';

      // Simula que ya existe un seguimiento
      findOneStub.resolves({ followerUserId, followedUserId });

      try {
        await followingService.createFollowing(followerUserId, followedUserId);
      } catch (err) {
        expect(err.message).to.equal('Ya sigues a este usuario'); // Verifica que el mensaje de error sea el esperado
      }
    });
  });

  describe('getFollowers', () => {
    it('should return followers successfully', async () => {
      const userId = 'followed123';
      const mockFollowers = [
        { followerUserId: { name: 'John Doe', email: 'john@example.com' } },
        { followerUserId: { name: 'Jane Doe', email: 'jane@example.com' } },
      ];

      // Simula el comportamiento de .find().populate()
      findStub.callsFake(() => ({
        populate: sinon.stub().resolves(mockFollowers),
      }));

      const result = await followingService.getFollowers(userId);

      expect(result).to.eql(mockFollowers); // Verifica que los seguidores se obtienen correctamente
    });
  });

  describe('getFollowedUsers', () => {
    it('should return followed users successfully', async () => {
      const userId = 'follower123';
      const mockFollowedUsers = [
        { followedUserId: { name: 'Alice', email: 'alice@example.com' } },
        { followedUserId: { name: 'Bob', email: 'bob@example.com' } },
      ];

      // Simula el comportamiento de .find().populate()
      findStub.callsFake(() => ({
        populate: sinon.stub().resolves(mockFollowedUsers),
      }));

      const result = await followingService.getFollowedUsers(userId);

      expect(result).to.eql(mockFollowedUsers); // Verifica que los usuarios seguidos se obtienen correctamente
    });
  });

  describe('deleteFollowing', () => {
    it('should delete following successfully', async () => {
      const followerUserId = 'follower123';
      const followedUserId = 'followed123';

      // Simula que existe un seguimiento
      findOneAndDeleteStub.resolves({ followerUserId, followedUserId });

      const result = await followingService.deleteFollowing(followerUserId, followedUserId);

      expect(result).to.eql({ followerUserId, followedUserId }); // Verifica que el seguimiento se haya eliminado correctamente
    });

    it('should throw error if following does not exist', async () => {
      const followerUserId = 'follower123';
      const followedUserId = 'followed123';

      // Simula que no existe el seguimiento
      findOneAndDeleteStub.resolves(null);

      try {
        await followingService.deleteFollowing(followerUserId, followedUserId);
      } catch (err) {
        expect(err.message).to.equal('El seguimiento no existe'); // Verifica que el mensaje de error sea el esperado
      }
    });
  });
});