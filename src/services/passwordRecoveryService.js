// services/passwordRecoveryService.js

import User from '../models/userModel.js'; // Asegúrate de que este es tu modelo de usuario

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    // Obtener al usuario de la base de datos
    console.log('Buscando usuario con ID:', userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log('Usuario no encontrado');
      throw new Error('Usuario no encontrado');
    }

    // Mostrar las contraseñas para depuración
    console.log('Contraseña actual proporcionada:', currentPassword);
    console.log('Contraseña almacenada:', user.password);

    // Comparar la contraseña actual con la almacenada (sin cifrado)
    if (currentPassword !== user.password) {
      console.log('Las contraseñas no coinciden');
      throw new Error('La contraseña actual no es correcta');
    }

    // Si las contraseñas coinciden, actualizamos la contraseña
    user.password = newPassword; // Aquí la nueva contraseña se guarda en texto plano
    await user.save();

    return {
      message: 'Contraseña cambiada exitosamente',
    };
  } catch (error) {
    console.log('Error al actualizar la contraseña:', error.message);
    throw new Error(`Error al actualizar la contraseña: ${error.message}`);
  }
};