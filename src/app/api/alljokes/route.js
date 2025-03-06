import { dbConnect } from '@/lib/db';
import { Joke } from '@/lib/model/Joke';
import User from '@/lib/model/User'; 

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all jokes and populate user details (userName field)
    const jokes = await Joke.find()
      .populate('user', 'userName') // Populate 'user' field with 'userName'
      .exec();

    // Add likedBy field to each joke and handle cases where user is null
    const jokesWithLikes = jokes
      .map((joke) => ({
        ...joke.toObject(),
        likedBy: joke.likes || [], // Ensure likedBy is always an array
        userName: joke.user ? joke.user.userName : null, // Set userName to null if user is null
      }))
      .sort(() => Math.random() - 0.5); // Shuffle jokes before sending

    // Return jokes as JSON response with CORS headers
    return new Response(JSON.stringify({ jokes: jokesWithLikes }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching jokes:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch jokes. Please try again.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}
