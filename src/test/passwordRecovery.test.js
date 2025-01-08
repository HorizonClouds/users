import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import UserModel from '../models/userModel.js';
import * as passwordRecoveryService from '../services/passwordRecoveryService.js';

describe('PasswordRecoveryService - Change Password', () => {
  let findByIdStub;
  let saveStub;

  beforeEach(() => {
    findByIdStub = sinon.stub(UserModel, 'findById');
    saveStub = sinon.stub(UserModel.prototype, 'save');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should successfully change the user password if the current password is correct', async () => {
    const userId = new mongoose.Types.ObjectId();
    const currentPassword = 'currentPassword123';
    const newPassword = 'newPassword456';

    const mockUser = {
      _id: userId,
      password: currentPassword,  // Usamos la contraseña actual
      save: saveStub.resolves(),
    };

    findByIdStub.resolves(mockUser);

    // Llamamos al servicio para cambiar la contraseña
    const result = await passwordRecoveryService.changeUserPassword(
      userId.toString(),
      currentPassword,
      newPassword
    );

    // Verificamos si el usuario fue encontrado correctamente
    expect(findByIdStub.calledOnceWith(userId.toString())).to.be.true;

    // Verificamos que la contraseña se haya actualizado correctamente
    expect(mockUser.password).to.equal(newPassword);  // Ahora debe ser la nueva contraseña
    expect(saveStub.calledOnce).to.be.true;

    // Verificamos que el mensaje sea el esperado
    expect(result.message).to.equal('Contraseña cambiada exitosamente');
  });

  it('should throw an error if the current password is incorrect', async () => {
    const userId = new mongoose.Types.ObjectId();
    const currentPassword = 'wrongPassword123';
    const newPassword = 'newPassword456';

    const mockUser = {
      _id: userId,
      password: 'correctPassword123',  // Contraseña incorrecta
    };

    findByIdStub.resolves(mockUser);

    try {
      await passwordRecoveryService.changeUserPassword(userId.toString(), currentPassword, newPassword);
    } catch (error) {
      expect(error.message).to.equal('Error al actualizar la contraseña: La contraseña actual no es correcta');
    }

    expect(findByIdStub.calledOnceWith(userId.toString())).to.be.true;
    expect(saveStub.called).to.be.false;
  });

  it('should throw an error if the user is not found', async () => {
    const userId = new mongoose.Types.ObjectId();
    const currentPassword = 'currentPassword123';
    const newPassword = 'newPassword456';

    findByIdStub.resolves(null);

    try {
      await passwordRecoveryService.changeUserPassword(userId.toString(), currentPassword, newPassword);
    } catch (error) {
      expect(error.message).to.equal('Error al actualizar la contraseña: Usuario no encontrado');
    }

    expect(findByIdStub.calledOnceWith(userId.toString())).to.be.true;
    expect(saveStub.called).to.be.false;
  });

  it('should throw an error if there is an issue saving the new password', async () => {
    const userId = new mongoose.Types.ObjectId();
    const currentPassword = 'currentPassword123';
    const newPassword = 'newPassword456';

    const mockUser = {
      _id: userId,
      password: currentPassword,
      save: saveStub.rejects(new Error('Database error')),
    };

    findByIdStub.resolves(mockUser);

    try {
      await passwordRecoveryService.changeUserPassword(userId.toString(), currentPassword, newPassword);
    } catch (error) {
      expect(error.message).to.equal('Error al actualizar la contraseña: Database error');
    }

    expect(findByIdStub.calledOnceWith(userId.toString())).to.be.true;
    expect(saveStub.calledOnce).to.be.true;
  });
});