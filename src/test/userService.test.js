import { expect } from 'chai';
import sinon from 'sinon';
import { sendError, sendSuccess } from '../utils/standardResponse.js';  
import UsersModel from '../models/userModel.js';
import * as userService from '../services/userService.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

describe('User Service', () => {

  // Stubs para los métodos de UsersModel
  let createUserStub;
  let findAllUsersStub;
  let findUserByIdStub;
  let updateUserStub;
  let deleteUserStub;
  let findOneUserStub;
  let jwtSignStub;
  let res;

  beforeEach(() => {
    // Inicializa los stubs
    createUserStub = sinon.stub(UsersModel.prototype, 'save');
    findAllUsersStub = sinon.stub(UsersModel, 'find');
    findUserByIdStub = sinon.stub(UsersModel, 'findById');
    updateUserStub = sinon.stub(UsersModel, 'findByIdAndUpdate');
    deleteUserStub = sinon.stub(UsersModel, 'findByIdAndDelete');
    findOneUserStub = sinon.stub(UsersModel, 'findOne');
    jwtSignStub = sinon.stub(jwt, 'sign');
    res = {
      status: sinon.stub().returnsThis(), // Devuelve el mismo objeto res para encadenar el método json
      json: sinon.spy(), // Simula la función json
    };
  });

  afterEach(() => {
    // Restaurar los stubs después de cada prueba
    sinon.restore();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        photo: 'photo.jpg',
        biography: 'Biography text',
        email: 'johndoe@example.com',
        password: 'password123',
      };

      createUserStub.resolves(userData);  // Simula el comportamiento de la base de datos

      const result = await userService.createUser(userData);

      expect(result).to.eql(userData);  // Verifica que el resultado sea el esperado
    });

    it('should throw error if user creation fails', async () => {
      const userData = {
        name: 'John Doe',
        photo: 'photo.jpg',
        biography: 'Biography text',
        email: 'johndoe@example.com',
        password: 'password123',
      };

      createUserStub.rejects(new Error('Error creating user'));  // Simula un error

      try {
        await userService.createUser(userData);
      } catch (err) {
        expect(err.message).to.equal('Error creating user');  // Verifica el mensaje de error
      }
    });
  });

  describe('getAllUsers', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
      findAllUsersStub.resolves(mockUsers);

      const result = await userService.getAllUsers();

      expect(result).to.eql(mockUsers);  // Verifica que los usuarios sean los esperados
    });

    it('should throw error if there is an issue fetching users', async () => {
      findAllUsersStub.rejects(new Error('Error fetching users'));

      try {
        await userService.getAllUsers();
      } catch (err) {
        expect(err.message).to.equal('Error fetching users');
      }
    });
  });

  describe('getUsersById', () => {
    it('should fetch a user by id successfully', async () => {
      const mockUser = { name: 'John Doe' };
      findUserByIdStub.resolves(mockUser);

      const result = await userService.getUsersById('userId123');

      expect(result).to.eql(mockUser);  // Verifica que el usuario devuelto sea el esperado
    });

    it('should throw error if user is not found', async () => {
      findUserByIdStub.resolves(null);

      try {
        await userService.getUsersById('nonExistingId');
      } catch (err) {
        expect(err.message).to.equal('user not found');
      }
    });
  });

  describe('updateUsers', () => {
    it('should update user successfully', async () => {
      const updatedUser = { name: 'Updated Name' };
      updateUserStub.resolves(updatedUser);

      const result = await userService.updateUsers('userId123', { name: 'Updated Name' });

      expect(result).to.eql(updatedUser);  // Verifica que la actualización sea exitosa
    });

    it('should throw error if user is not found for update', async () => {
      updateUserStub.resolves(null);

      try {
        await userService.updateUsers('nonExistingId', { name: 'Updated Name' });
      } catch (err) {
        expect(err.message).to.equal('user not found');
      }
    });
  });

  describe('deleteUsers', () => {
    it('should delete user successfully', async () => {
      const deletedUser = { name: 'John Doe' };
      deleteUserStub.resolves(deletedUser);

      const result = await userService.deleteUsers('userId123');

      expect(result).to.eql(deletedUser);  // Verifica que el usuario se haya eliminado correctamente
    });

    it('should throw error if user is not found for deletion', async () => {
      deleteUserStub.resolves(null);

      try {
        await userService.deleteUsers('nonExistingId');
      } catch (err) {
        expect(err.message).to.equal('user not found');
      }
    });
  });

  describe('login', () => {
    it('should authenticate a user successfully', async () => {
      const userData = { userName: 'johndoe', password: 'password123' };
      const mockUser = { name: 'John Doe', roles: ['user'], userId: 'userId123' };
      const mockToken = 'mock.jwt.token';

      // Simula la respuesta de la base de datos
      findOneUserStub.resolves(mockUser);
      jwtSignStub.returns(mockToken);

      // Llamada a la función login
      await userService.login(userData, res);

      // Verifica que el método status fue llamado con el código 200
      expect(res.status.calledWith(200)).to.be.true;

      // Verifica que json fue llamado una vez
      expect(res.json.calledOnce).to.be.true;

      // Verifica el contenido de la respuesta
      expect(res.json.args[0][0].message).to.equal('Authentication successful');
      expect(res.json.args[0][0].data.token).to.equal(mockToken);
    });

    it('should fail login with incorrect credentials', async () => {
      const userData = { userName: 'wronguser', password: 'wrongpassword' };

      // Simula que no se encuentra el usuario
      findOneUserStub.resolves(null);

      // Llamada a la función login
      await userService.login(userData, res);

      // Verifica que status fue llamado con el código 401
      expect(res.status.calledWith(401)).to.be.true;

      // Verifica que json fue llamado una vez
      expect(res.json.calledOnce).to.be.true;

      // Verifica que el mensaje sea 'Invalid credentials'
      expect(res.json.args[0][0].message).to.equal('Invalid credentials');
    });
  });
});
