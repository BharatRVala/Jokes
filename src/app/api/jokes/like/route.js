import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { dbConnect } from '../../../../lib/db';
import { Joke } from '../../../../lib/model/Joke';

// Force dynamic route handling
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    // 1. Get auth token from cookies (properly awaited)
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      console.error('Missing auth token');
      return Response.json(
        { error: 'Unauthorized: Missing auth token' },
        { status: 401 }
      );
    }

    // 2. Verify JWT token
    let decodedToken;
    try {
      decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return Response.json(
        { error: 'Unauthorized: Invalid or expired token' },
        { status: 401 }
      );
    }

    // 3. Validate user ID
    const userId = decodedToken.userId;
    if (!userId) {
      console.error('Invalid token payload - missing userId');
      return Response.json(
        { error: 'Unauthorized: Invalid token payload' },
        { status: 401 }
      );
    }

    // 4. Parse request body
    let jokeId;
    try {
      const body = await req.json();
      jokeId = body.jokeId;
      
      if (!jokeId) {
        console.error('Joke ID is required');
        return Response.json(
          { error: 'Bad Request: Joke ID is required' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error parsing request body:', error);
      return Response.json(
        { error: 'Bad Request: Invalid request body' },
        { status: 400 }
      );
    }

    // 5. Database operations
    await dbConnect();

    const joke = await Joke.findById(jokeId);
    if (!joke) {
      console.error(`Joke not found: ${jokeId}`);
      return Response.json(
        { error: 'Not Found: Joke not found' },
        { status: 404 }
      );
    }

    // 6. Toggle like status
    const userAlreadyLiked = joke.likes.includes(userId);
    if (userAlreadyLiked) {
      joke.likes = joke.likes.filter(id => id.toString() !== userId);
    } else {
      joke.likes.push(userId);
    }

    const updatedJoke = await joke.save();

    // 7. Return response
    return Response.json({
      success: true,
      message: userAlreadyLiked 
        ? 'Like removed successfully' 
        : 'Like added successfully',
      joke: updatedJoke,
      likeCount: updatedJoke.likes.length,
      isLiked: !userAlreadyLiked
    });

  } catch (error) {
    console.error('Server error:', error);
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}