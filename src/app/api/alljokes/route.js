import { dbConnect } from '@/lib/db';
import { Joke } from '@/lib/model/Joke';
import User from '@/lib/model/User'; // Ensure that User is imported

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all jokes and populate user details (userName field)
    // Include a fallback for jokes with no user
    const jokes = await Joke.find()
      .populate('user', 'userName') // Populating the 'user' field with the 'userName' from User model
      .exec();

    // Add likedBy field to each joke and handle cases where user is null
    const jokesWithLikes = jokes.map((joke) => ({
      ...joke.toObject(),
      likedBy: joke.likes || [], // Ensure likedBy is always an array
      userName: joke.user ? joke.user.userName : null, // If user is null, set userName to null
    }));

    // Return jokes as JSON response
    return new Response(JSON.stringify({ jokes: jokesWithLikes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching jokes:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch jokes. Please try again.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
