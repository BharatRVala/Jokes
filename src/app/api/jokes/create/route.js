import { Joke } from '@/lib/model/Joke';
import { User } from '@/lib/model/User';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/db';

export async function POST(req) {
  try {
    await dbConnect();

    const { content, userId } = await req.json();

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


    return new Response(
      JSON.stringify({ message: "Joke published successfully!", joke: newJoke }),
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
