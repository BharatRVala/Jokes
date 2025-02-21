import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { dbConnect } from '../../../../lib/db';
import { Joke } from '../../../../lib/model/Joke';

export async function POST(req) {
  try {
    const cookieStore = await cookies(); // Ensure cookies() is awaited
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      console.error('Missing auth token.');
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing auth token.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return new Response(JSON.stringify({ error: 'Invalid or expired token. Relogin.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = decodedToken.userId;

    if (!userId) {
      console.error('Token payload missing userId.');
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token payload.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { jokeId } = await req.json();
    if (!jokeId) {
      console.error('Joke ID is missing in request.');
      return new Response(JSON.stringify({ error: 'Joke ID is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await dbConnect();

    const joke = await Joke.findById(jokeId);
    if (!joke) {
      console.error(`Joke not found for ID: ${jokeId}`);
      return new Response(JSON.stringify({ error: 'Joke not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userAlreadyLiked = joke.likes.includes(userId);

    if (userAlreadyLiked) {
      joke.likes = joke.likes.filter((id) => id.toString() !== userId);
    } else {
      joke.likes.push(userId);
    }

    await joke.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: userAlreadyLiked ? 'Like removed from the joke.' : 'Like added to the joke.',
        joke,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Internal server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
