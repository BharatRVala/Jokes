// src/lib/db.js
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

let isConnected = false; // Track the connection status

// Function to establish the database connection
export async function dbConnect() {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      // No need for deprecated options anymore
      serverSelectionTimeoutMS: 30000, // Timeout in 30 seconds
      // Use environment-specific options here, e.g., `useCreateIndex` if needed
    });

    isConnected = db.connections[0].readyState === 1;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

// Helper function to fetch user by ID from the database
export async function getUserById(userId) {
  const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  }));

  try {
    const user = await User.findById(userId).exec();
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    throw error;
  }
}

// Helper function to fetch jokes by userId from the database
export async function getJokesByUserId(userId) {
  const Joke = mongoose.models.Joke || mongoose.model('Joke', new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }));

  try {
    const jokes = await Joke.find({ userId }).exec();
    return jokes;
  } catch (error) {
    console.error('Error fetching jokes by user ID:', error.message);
    throw error;
  }
}
