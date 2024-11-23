// exampleModel.js

import mongoose from 'mongoose'; // Import Mongoose

// Create a schema for Example with validation
const userModelSchema = new mongoose.Schema({
  name : {
    type : String,
    required : [true, 'Name is required'],
    trim : true,
  },
  photo : {
    type : String,
    required : [true, 'Photo is required'],
  },
  biography : {
    type : String,
    required : [true, 'Biography is required'],
    trim : true,
  },
  email : {
    type : String,
    required : [true, 'Email is required'],
    trim : true,
    unique: true, // Garantiza que el correo sea único
    lowercase: true, // Almacena siempre en minúsculas
  },
  password : {
    type : String,
    required : [true, 'Password is required'],
    trim : true,
  },
  registrationDate : {
    type : Date,
    default : Date.now,
  },
  accountStatus : {
    type : String,
    enum : ['active', 'inactive'],
    default : 'active',
  },
  friendRequestStatus : {
    type : String,
    enum : ['pending', 'accepted', 'rejected'],
    default : 'pending',
  },
});

// Create the model from the schema
const userModel = mongoose.model('Users', userModelSchema);

export default userModel; // Export the model
