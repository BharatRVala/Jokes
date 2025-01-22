import { dbConnect } from '@/lib/db';
import { Joke } from '@/lib/model/Joke';
import { User } from '@/lib/model/User';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    // Extract token from cookies
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized access. Please log in.' }),
        { status: 401 }
      );
    }

    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Get user ID from the decoded token

    // Connect to the database
    await dbConnect();

    // Find the user in the database by ID
    const user = await User.findById(userId).exec();
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    // Find all jokes that belong to the logged-in user
    const userJokes = await Joke.find({ user: userId }).exec();

    // Return the jokes associated with the logged-in user
    return new Response(
      JSON.stringify({ message: 'Jokes fetched successfully', jokes: userJokes }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching jokes:', error);
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500 }
    );
  }
}
