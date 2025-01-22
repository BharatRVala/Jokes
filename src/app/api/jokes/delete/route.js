import { Joke } from '@/lib/model/Joke'; // Import the Joke model
import mongoose from 'mongoose';

export async function DELETE(req) {
  try {
    // Parse the request body
    const { jokeId, userId } = await req.json();

    // Validate jokeId and userId format
    if (!mongoose.Types.ObjectId.isValid(jokeId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return new Response('Invalid jokeId or userId format', { status: 400 });
    }

    // Find the joke by ID
    const joke = await Joke.findById(jokeId);

    if (!joke) {
      return new Response('Joke not found', { status: 404 });
    }

    // Ensure the user requesting the delete is the owner of the joke
    if (joke.user.toString() !== userId) {
      return new Response('Unauthorized: You can only delete your own jokes', { status: 403 });
    }

    // Delete the joke from the database using findByIdAndDelete
    await Joke.findByIdAndDelete(jokeId);

    // Return a success response
    return new Response('Joke deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting joke:', error);
    return new Response('Failed to delete joke. Please try again.', { status: 500 });
  }
}
