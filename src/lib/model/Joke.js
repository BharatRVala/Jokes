import mongoose from 'mongoose';

const JokeSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId], // Ensure it's an array of ObjectIds
      ref: 'User',
      default: [], // Default value as an empty array
    },
  },
  { timestamps: true }
);

export const Joke = mongoose.models.Joke || mongoose.model('Joke', JokeSchema);
