import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import { User } from '@/lib/model/User';

export async function PUT(req) {
  try {
    const { userId, userName, email, password } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
    }

    if (!userName && !email && !password) {
      return new Response(JSON.stringify({ message: 'No fields to update' }), { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Check if email already exists (excluding the current user)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new Response(JSON.stringify({ message: 'This email is already in use' }), { status: 400 });
      }
      user.email = email;
    }

    // Check if username already exists (excluding the current user)
    if (userName && userName !== user.userName) {
      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        return new Response(JSON.stringify({ message: 'This username is already in use' }), { status: 400 });
      }
      user.userName = userName;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return new Response(
      JSON.stringify({ message: 'User updated successfully', user: { id: user._id, userName: user.userName, email: user.email } }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Something went wrong', error: error.message }), { status: 500 });
  }
}
