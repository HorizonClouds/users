// tests/followingService.test.js
import { expect } from 'chai';
import sinon from 'sinon';
import * as followingService from '../services/followingService.js';
import followingModel from '../models/followingModel.js';
import mongoose from 'mongoose';

describe('Following Service', () => {
  let findOneStub;
  let findStub;
  let createStub;
  let findOneAndDeleteStub;

  beforeEach(() => {
    findOneStub = sinon.stub(followingModel, 'findOne');
    findStub = sinon.stub(followingModel, 'find');
    createStub = sinon.stub(followingModel.prototype, 'save');
    findOneAndDeleteStub = sinon.stub(followingModel, 'findOneAndDelete');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createFollowing', () => {
    it('should create a new following successfully', async () => {
      const followerUserId = new mongoose.Types.ObjectId();
      const followedUserId = new mongoose.Types.ObjectId();

      findOneStub.resolves(null); // No existe un seguimiento previo

      const createdFollowing = {
        _id: new mongoose.Types.ObjectId(),
        followerUserId,
        followedUserId,
        followUpDate: new Date(),
      };
      createStub.resolves(createdFollowing);

      const result = await followingService.createFollowing(followerUserId, followedUserId);

      // Verificar que los ObjectId son del tipo correcto
      expect(result._id).to.be.a('string');
      expect(result.followerUserId).to.be.a('string');
      expect(result.followedUserId).to.be.a('string');

      // Verificar que la fecha sea razonable
      expect(new Date(result.followUpDate).getTime()).to.be.closeTo(new Date(createdFollowing.followUpDate).getTime(), 1000); // Permitir 1 segundo de diferencia

      // También verificamos que los valores sean correctos
      expect(result.followerUserId).to.equal(followerUserId.toString());
      expect(result.followedUserId).to.equal(followedUserId.toString());
    });

    it('should throw error if following already exists', async () => {
      const followerUserId = new mongoose.Types.ObjectId();
      const followedUserId = new mongoose.Types.ObjectId();

      findOneStub.resolves({
        followerUserId,
        followedUserId,
        followUpDate: new Date(),
      });

      try {
        await followingService.createFollowing(followerUserId, followedUserId);
      } catch (err) {
        expect(err.message).to.equal('Ya sigues a este usuario');
      }
    });
  });

  describe('getFollowers', () => {
    it('should return followers successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockFollowers = [
        { followerUserId: new mongoose.Types.ObjectId() },
        { followerUserId: new mongoose.Types.ObjectId() },
      ];

      findStub.resolves(mockFollowers);  // Simulamos que find() devuelve un arreglo de documentos

      const result = await followingService.getFollowers(userId);

      // Verificar que el resultado sea un arreglo de ObjectIds en formato de cadena
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(mockFollowers.length);
      mockFollowers.forEach((follower, index) => {
        expect(result[index]).to.equal(follower.followerUserId.toString());
      });
    });
  });

  describe('getFollowedUsers', () => {
    it('should return followed users successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockFollowedUsers = [
        { followedUserId: new mongoose.Types.ObjectId() },
        { followedUserId: new mongoose.Types.ObjectId() },
      ];

      findStub.resolves(mockFollowedUsers);  // Simulamos que find() devuelve un arreglo de documentos

      const result = await followingService.getFollowedUsers(userId);

      // Verificar que el resultado sea un arreglo de ObjectIds en formato de cadena
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(mockFollowedUsers.length);
      mockFollowedUsers.forEach((followed, index) => {
        expect(result[index]).to.equal(followed.followedUserId.toString());
      });
    });
  });

  describe('deleteFollowing', () => {
    it('should delete following successfully', async () => {
      const followerUserId = new mongoose.Types.ObjectId();
      const followedUserId = new mongoose.Types.ObjectId();

      findOneAndDeleteStub.resolves({
        _id: new mongoose.Types.ObjectId(),
        followerUserId,
        followedUserId,
        followUpDate: new Date(),
      });

      const result = await followingService.deleteFollowing(followerUserId, followedUserId);

      // Verificar que los ObjectId son del tipo correcto
      expect(result._id).to.be.a('string');
      expect(result.followerUserId).to.be.a('string');
      expect(result.followedUserId).to.be.a('string');

      // Verificar que la fecha sea razonable
      expect(new Date(result.followUpDate).getTime()).to.be.closeTo(new Date().getTime(), 1000); // Permitir 1 segundo de diferencia

      // También verificamos que los valores sean correctos
      expect(result.followerUserId).to.equal(followerUserId.toString());
      expect(result.followedUserId).to.equal(followedUserId.toString());
    });

    it('should throw error if following does not exist', async () => {
      const followerUserId = new mongoose.Types.ObjectId();
      const followedUserId = new mongoose.Types.ObjectId();

      findOneAndDeleteStub.resolves(null);

      try {
        await followingService.deleteFollowing(followerUserId, followedUserId);
      } catch (err) {
        expect(err.message).to.equal('El seguimiento no existe');
      }
    });
  });
});