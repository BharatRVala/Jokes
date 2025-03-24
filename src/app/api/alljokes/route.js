import { dbConnect } from '@/lib/db';
import { Joke } from '@/lib/model/Joke';
import User from '@/lib/model/User';

export async function GET(req) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const userId = url.searchParams.get("userId");

    let filter = {};

    if (category === "latest") {
      filter = {};
    } else if (category === "most-popular") {
      filter = { likes: { $exists: true, $not: { $size: 0 } } }; // Jokes with likes
    } else if (category === "my-jokes" && userId) {
      filter = { user: userId }; // Fetch only the jokes created by the logged-in user
    }

    const jokes = await Joke.find(filter)
      .sort(category === "latest" ? { createdAt: -1 } : { likes: -1, createdAt: -1 }) // Sort by likes first, then by latest
      .populate('user', 'userName')
      .exec();

    const jokesWithLikes = jokes.map((joke) => ({
      ...joke.toObject(),
      likedBy: joke.likes || [],
      userName: joke.user ? joke.user.userName : null,
    }));

    return new Response(JSON.stringify({ jokes: jokesWithLikes }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
