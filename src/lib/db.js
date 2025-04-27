import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

let isConnected = false; // Track the connection status

// Function to establish the database connection
export async function dbConnect() {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Timeout in 30 seconds
    });

    isConnected = db.connections[0].readyState === 1;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

// Exporting getJokesByUserId function
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
