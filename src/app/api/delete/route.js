import { dbConnect } from '@/lib/db';
import { User } from '@/lib/model/User';
import { Joke } from '@/lib/model/Joke'; // Import the Joke model
import jwt from 'jsonwebtoken';

export async function DELETE(req) {
  try {
    // Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ message: 'Authorization header is missing' }),
        { status: 401 }
      );
    }

    // Extract and verify the token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return new Response(
        JSON.stringify({ message: 'Authorization token is missing' }),
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret is not configured in the environment');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return new Response(
        JSON.stringify({ message: 'Invalid or expired token' }),
        { status: 401 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Find and delete the user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    // Delete all jokes associated with this user
    await Joke.deleteMany({ user: decoded.userId });

    // Delete the user
    await User.findByIdAndDelete(decoded.userId);

    return new Response(
      JSON.stringify({ message: 'User account and all associated jokes deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user and jokes:', error.message);
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500 }
    );
  }
}
