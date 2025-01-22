import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import { User } from '@/lib/model/User';

export async function POST(req) {
  try {
    // Parse the request body
    const { userName, email, password } = await req.json();

    // Validate the input
    if (!userName || !email || !password) {
      return new Response(
        JSON.stringify({ message: 'userName, email, and password are required' }),
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Check if the email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      const conflictField = existingUser.email === email ? 'email' : 'userName';
      return new Response(
        JSON.stringify({ message: `${conflictField} already exists` }),
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    // Respond with success
    return new Response(
      JSON.stringify({ message: 'Signup successful', user }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500 }
    );
  }
}
