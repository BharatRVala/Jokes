import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    jokes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Joke', // Reference to the Joke model
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export { User };
