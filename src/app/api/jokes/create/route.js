import { Joke } from '@/lib/model/Joke'; // Import the Joke model
import { User } from '@/lib/model/User'; // Import the User model
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/db'; // Ensure database connection

export async function POST(req) {
  try {
    await dbConnect(); // Ensure DB connection

    const { content, userId } = await req.json();
    console.log("Received request to create joke:", { content, userId });

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId);
      return new Response(
        JSON.stringify({ error: 'Invalid userId format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newJoke = new Joke({ content, user: userId });
    await newJoke.save();
    user.jokes.push(newJoke._id);
    await user.save();

    console.log("Joke created successfully:", newJoke);

    return new Response(
      JSON.stringify(newJoke),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error creating joke:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to create joke. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
