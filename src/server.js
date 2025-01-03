// server.js

import express from 'express'; // Import Express framework
import mongoose from 'mongoose'; // Import Mongoose for MongoDB
import { swaggerSetup } from './swagger.js'; // Import Swagger setup
import apiRouter from './routes/userRoute.js'; // Import API routes
import apiRouterExample from './routes/exampleRoute.js'; // Import API routes
import apiRouterLoginHistory from './routes/logInRoute.js'; // Import API routes
import apiRouterPassword from './routes/passwordRecoveryRequestRoute.js'; // Import API routes
import apiRouterFollowing from './routes/followingRoute.js'; // Import API routes
import apiRouterFriendRequest from './routes/friendRequestRoute.js'; // Import API routes
import dotenv from 'dotenv'; // Import dotenv for environment variables
import standardizedResponse from './middlewares/standardResponse.js'; // Import custom response middleware
import { MongoMemoryServer } from 'mongodb-memory-server';
import cors from 'cors'; // Import cors

dotenv.config(); // Load environment variables

const app = express(); // Create an Express application
const port = process.env.BACKEND_PORT || 6201; // Define port

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(standardizedResponse); // Use custom response middleware
app.use(cors()); // Use cors

// Routes
app.use('/api', apiRouter); // Use API routes
app.use('/api', apiRouterExample); // Use API routes
app.use('/api', apiRouterLoginHistory); // Use API routes
app.use('/api', apiRouterPassword); // Use API routes
app.use('/api', apiRouterFollowing); // Use API routes
app.use('/api', apiRouterFriendRequest); // Use API routes

app.get('/', (req, res) => {
  // Redirect to API documentation
  res.redirect('/api-docs');
});

// Swagger configuration
swaggerSetup(app);

// Connect to MongoDB
let mongoURI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/microservice';
if (process.env.NODE_ENV === 'test') {
  const mongod = new MongoMemoryServer(); // Fake MongoDB for testing
  await mongod.start();
  mongoURI = mongod.getUri();
  console.log(mongoURI);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(
    `API documentation is available at http://localhost:${port}/api-docs`
  );
});

export default app; // Export the Express application
