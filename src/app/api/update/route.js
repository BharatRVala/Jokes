import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import { User } from '@/lib/model/User';

export async function PUT(req) {
  try {
    // Parse the request body
    const { userId, userName, email, password } = await req.json();

    // Validate input
    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'User ID is required' }),
        { status: 400 }
      );
    }

    if (!userName && !email && !password) {
      return new Response(
        JSON.stringify({ message: 'No fields to update' }),
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    // Update the fields if they are provided
    if (userName) user.userName = userName; // Ensure this matches your schema
    if (email) user.email = email;

    // If a password is provided, hash it before saving
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user
    await user.save();

    // Respond with success
    return new Response(
      JSON.stringify({
        message: 'User updated successfully',
        user: {
          id: user._id,
          userName: user.userName, // Ensure this matches your schema
          email: user.email,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500 }
    );
  }
}