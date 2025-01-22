import { Joke } from '@/lib/model/Joke'; // Import the Joke model
import { User } from '@/lib/model/User'; // Import the User model
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    // Get data from the request body
    const { content, userId } = await req.json();

    // Check if the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid userId format' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a new joke document
    const newJoke = new Joke({
      content,
      user: new mongoose.Types.ObjectId(userId),
    });

    // Save the joke to the database
    await newJoke.save();

    // Find the user and update the jokes array
    const user = await User.findById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add the new joke's ObjectId to the user's jokes array
    user.jokes.push(newJoke._id);
    
    // Save the updated user document
    await user.save();

    // Return the new joke as a success response
    return new Response(
      JSON.stringify(newJoke), 
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating joke:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create joke. Please try again.' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
