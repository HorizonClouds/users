import { expect } from 'chai';
import sinon from 'sinon';
import LoginHistory from '../models/loginHistoryModel.js';
import usersService from '../services/userService.js';
import loginHistoryService from '../services/logInHistoryService.js';
import { NotFoundError } from '../utils/customErrors.js';
import mongoose from 'mongoose';

describe('LoginHistory Service', () => {
  describe('createLoginHistory', () => {
    let findByIdStub;
    let saveStub;
    
    beforeEach(() => {
      // Simula un documento de Mongoose para el usuario con un _id como ObjectId válido
      const mockUser = {
        _id: new mongoose.Types.ObjectId(), // Aquí generamos un ObjectId válido
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        photo: 'photo_url',
        biography: 'This is a biography',
        roles: ['user'],
        accountStatus: 'active',
        registrationDate: Date.now(),
      };
  
      // Stub para el método getUsersById que simula un usuario encontrado
      findByIdStub = sinon.stub(usersService, 'getUsersById').resolves(mockUser);
  
      // Stub para el método save de LoginHistory
      saveStub = sinon.stub(LoginHistory.prototype, 'save');
    });
    
    afterEach(() => {
      findByIdStub.restore();
      saveStub.restore();
    });
    
    it('should create a new login history record successfully', async () => {
    
      const userId = new mongoose.Types.ObjectId(); // Crear un ObjectId válido para el test
      const newLoginHistory = {
        userId: userId, // Usamos un ObjectId válido para userId
        loginDate: '2025-01-01T12:00:00Z',
      };

      const mockSavedLoginHistory = {
        _id: new mongoose.Types.ObjectId(), // Simula un _id generado por MongoDB
        userId: userId,
        loginDate: '2025-01-01T12:00:00Z',
      };

      // Simular que el save se realiza correctamente
      saveStub.resolves(mockSavedLoginHistory);

      // Ejecutamos la función para crear el historial de inicio de sesión
      const result = await loginHistoryService.createLoginHistory(newLoginHistory);

      // Verificar el resultado
      expect(result._id).to.be.an.instanceof(mongoose.Types.ObjectId);
      expect(mockSavedLoginHistory._id).to.be.an.instanceof(mongoose.Types.ObjectId);
      logger.debug(result._id.toString(), mockSavedLoginHistory._id.toString()); // Añadimos logs para ver los valores
      expect(result.userId.equals(userId)).to.be.true; // Verificar que los ObjectId de userId son iguales
      const resultDate = new Date(result.loginDate).toISOString().slice(0, -5); // Elimina los milisegundos
  
    });
    
    it('should throw NotFoundError if the user does not exist', async () => {
      findByIdStub.resolves(null); // Simula que el usuario no existe
      
      const newLoginHistory = { userId: 'userId1' };
      
      try {
        await loginHistoryService.createLoginHistory(newLoginHistory);
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal('User not found');
      }
    });
    
    it('should throw an error if saving login history fails', async () => {
      const mockUser = { _id: 'userId1', name: 'John Doe' };
      findByIdStub.resolves(mockUser); // Simula que el usuario existe
      
      const newLoginHistory = { userId: 'userId1' };
      saveStub.rejects(new Error('Database error')); // Simula un error al guardar
      
      try {
        await loginHistoryService.createLoginHistory(newLoginHistory);
      } catch (error) {
        expect(error.message).to.equal('Database error');
      }
    });
  });

  describe('getAllLoginHistory', () => {
    let findStub;
    
    beforeEach(() => {
      findStub = sinon.stub(LoginHistory, 'find');
    });
    
    afterEach(() => {
      findStub.restore();
    });
    
    it('should return all login history records', async () => {
      const mockLoginHistory = [
        { userId: 'userId1', loginDate: '2025-01-01T12:00:00Z' },
        { userId: 'userId2', loginDate: '2025-01-02T12:00:00Z' },
      ];
      findStub.resolves(mockLoginHistory); // Simula que se obtienen los registros de inicio de sesión
      
      const result = await loginHistoryService.getAllLoginHistory();
      
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.have.property('userId').equal('userId1');
      expect(result[1]).to.have.property('userId').equal('userId2');
    });
    
    it('should throw an error if retrieval fails', async () => {
      findStub.rejects(new Error('Database error')); // Simula un error al obtener los registros
      
      try {
        await loginHistoryService.getAllLoginHistory();
      } catch (error) {
        expect(error.message).to.equal('An error occurred while retrieving login history');
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
      const mockUser = { _id: 'userId1', name: 'John Doe' };
      findByIdStub.resolves(mockUser); // Simula que el usuario existe
      
      const mockLoginHistory = { userId: 'userId1', loginDate: '2025-01-01T12:00:00Z' };
      findOneStub.resolves(mockLoginHistory); // Simula que el registro existe
      
      const result = await loginHistoryService.getLoginHistoryById('userId1');
      
      expect(result).to.have.property('userId').equal('userId1');
    });
    
    it('should throw NotFoundError if the login history does not exist', async () => {
      const mockUser = { _id: 'userId1', name: 'John Doe' };
      findByIdStub.resolves(mockUser); // Simula que el usuario existe
      
      findOneStub.resolves(null); // Simula que el registro no existe
      
      try {
        await loginHistoryService.getLoginHistoryById('userId1');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal('Login history not found');
      }
    });
  });

  describe('deleteLoginHistory', () => {
    let findByIdAndDeleteStub;
    
    beforeEach(() => {
      findByIdAndDeleteStub = sinon.stub(LoginHistory, 'findByIdAndDelete');
    });
    
    afterEach(() => {
      findByIdAndDeleteStub.restore();
    });
    
    it('should delete the login history record successfully', async () => {
      const mockDeletedHistory = { userId: 'userId1', loginDate: '2025-01-01T12:00:00Z' };
      findByIdAndDeleteStub.resolves(mockDeletedHistory); // Simula que el registro se eliminó correctamente
      
      const result = await loginHistoryService.deleteLoginHistory('userId1');
      
      expect(result).to.have.property('userId').equal('userId1');
    });
    
    it('should throw NotFoundError if the login history does not exist', async () => {
      findByIdAndDeleteStub.resolves(null); // Simula que el registro no existe
      
      try {
        await loginHistoryService.deleteLoginHistory('userId1');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal('Login history not found');
      }
    });
  });
});
