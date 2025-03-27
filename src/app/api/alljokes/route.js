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
    let sortCriteria = { createdAt: -1 }; // Default sort by latest

    if (category === "most-popular") {
      // Most popular - sort by likes count
      const aggregationPipeline = [
        {
          $addFields: {
            likesCount: { $size: { $ifNull: ["$likes", []] } }
          }
        },
        { $sort: { likesCount: -1, createdAt: -1 } }
      ];

      if (category === "my-jokes" && userId) {
        filter = { user: userId };  // Ensure userId is correctly used
      }
      

      const jokes = await Joke.aggregate(aggregationPipeline)
        .lookup({
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        })
        .unwind({ path: '$user', preserveNullAndEmptyArrays: true })
        .exec();

      const jokesWithDetails = jokes.map((joke) => ({
        ...joke,
        likeCount: joke.likesCount,
        userName: joke.user ? joke.user.userName : null,
      }));

      return new Response(JSON.stringify({ jokes: jokesWithDetails }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    } else if (category === "oldest") {
      // Oldest - sort by oldest first
      sortCriteria = { createdAt: 1 };
    } else if (category === "my-jokes" && userId) {
      filter = { user: userId };
    }

    const jokes = await Joke.find(filter)
      .sort(sortCriteria)
      .populate('user', 'userName')
      .exec();

    const jokesWithDetails = jokes.map((joke) => ({
      ...joke.toObject(),
      likeCount: joke.likes ? joke.likes.length : 0,
      userName: joke.user ? joke.user.userName : null,
    }));

    return new Response(JSON.stringify({ jokes: jokesWithDetails }), {
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