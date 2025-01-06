import { expect } from 'chai';
import sinon from 'sinon';
import PasswordRecoveryModel from '../models/passwordRecoveryRequestModel.js';
import * as passwordRecoveryService from '../services/passwordRecoveryService.js';

describe('PasswordRecoveryService', () => {

  describe('createPasswordRecoveryRequest', () => {
    let saveStub;

    beforeEach(() => {
      saveStub = sinon.stub(PasswordRecoveryModel.prototype, 'save');
    });

    afterEach(() => {
      saveStub.restore();
    });

    /*it('should create a new password recovery request successfully', async () => {
      const userId = 'userId1';
      const token = 'sampleToken123';

      const mockSavedRecoveryRequest = {
        userId,
        token,
        save: saveStub.resolves(),
      };

      saveStub.resolves(mockSavedRecoveryRequest);

      const result = await passwordRecoveryService.createPasswordRecoveryRequest(userId, token);
      
      expect(result).to.have.property('userId', userId);
      expect(result).to.have.property('token', token);
      expect(saveStub.calledOnce).to.be.true;
    });*/

    it('should throw an error if there is an issue saving the recovery request', async () => {
      const userId = 'userId1';
      const token = 'sampleToken123';

      saveStub.rejects(new Error('Database error'));

      try {
        await passwordRecoveryService.createPasswordRecoveryRequest(userId, token);
      } catch (error) {
        expect(error.message).to.equal('Error al crear la solicitud de recuperación de contraseña: Database error');
      }
    });
  });

  describe('validatePasswordRecoveryToken', () => {
    let findOneStub;

    beforeEach(() => {
      findOneStub = sinon.stub(PasswordRecoveryModel, 'findOne');
    });

    afterEach(() => {
      findOneStub.restore();
    });

    it('should return true if the recovery token is valid and not expired', async () => {
      const token = 'validToken123';
      const mockRecoveryRequest = {
        token,
        expiresTokenTime: Date.now() + 1800000, // Token no ha expirado
      };

      findOneStub.resolves(mockRecoveryRequest);

      const result = await passwordRecoveryService.validatePasswordRecoveryToken(token);
      
      expect(result).to.be.true;
      expect(findOneStub.calledOnceWith({ token })).to.be.true;
    });

    it('should return false if the recovery token is not found', async () => {
      const token = 'invalidToken123';

      findOneStub.resolves(null); // Simula que no se encuentra el token

      const result = await passwordRecoveryService.validatePasswordRecoveryToken(token);
      
      expect(result).to.be.false;
      expect(findOneStub.calledOnceWith({ token })).to.be.true;
    });

    it('should return false if the recovery token has expired', async () => {
      const token = 'expiredToken123';
      const mockRecoveryRequest = {
        token,
        expiresTokenTime: Date.now() - 1000, // Token ya ha expirado
      };

      findOneStub.resolves(mockRecoveryRequest);

      const result = await passwordRecoveryService.validatePasswordRecoveryToken(token);
      
      expect(result).to.be.false;
      expect(findOneStub.calledOnceWith({ token })).to.be.true;
    });
  });
});
