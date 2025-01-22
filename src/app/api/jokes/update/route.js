// api/jokes/update/route.js
import { Joke } from '@/lib/model/Joke'; // Import the Joke model
import mongoose from 'mongoose';

export async function PUT(req) {
  try {
    // Parse the request body
    const { jokeId, userId, content } = await req.json();

    // Validate jokeId and userId format
    if (!mongoose.Types.ObjectId.isValid(jokeId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return new Response('Invalid jokeId or userId format', { status: 400 });
    }

    // Find the joke by ID
    const joke = await Joke.findById(jokeId);

    if (!joke) {
      return new Response('Joke not found', { status: 404 });
    }

    // Ensure the user requesting the update is the owner of the joke
    if (joke.user.toString() !== userId) {
      return new Response('Unauthorized: You can only edit your own jokes', { status: 403 });
    }

    // Update the joke content
    joke.content = content;
    await joke.save();

    // Return the updated joke
    return new Response(JSON.stringify(joke), { status: 200 });
  } catch (error) {
    console.error('Error updating joke:', error);
    return new Response('Failed to update joke. Please try again.', { status: 500 });
  }
}
