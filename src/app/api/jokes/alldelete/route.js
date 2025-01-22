import { dbConnect, getJokesByUserId } from '@/lib/db';
import { cookies } from 'next/headers';

export async function DELETE(req) {
  try {
    // Get the auth_token from the cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    // Decode the token to get the user ID
    const decodedToken = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString());
    const userId = decodedToken.userId;

    // Connect to the database
    await dbConnect();

    // Get jokes by userId
    const jokes = await getJokesByUserId(userId);

    if (jokes.length === 0) {
      return new Response(JSON.stringify({ error: 'No jokes found for this user' }), { status: 404 });
    }

    // Delete all jokes for the user
    const result = await Joke.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'No jokes found for deletion' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'All jokes deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting jokes:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete jokes. Please try again.' }), { status: 500 });
  }
}
