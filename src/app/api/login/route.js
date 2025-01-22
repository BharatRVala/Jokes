import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import { User } from '@/lib/model/User';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ message: 'Invalid password' }), { status: 401 });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const cookies = cookie.serialize('auth_token', token, {
      httpOnly: false, // Set to false for frontend-accessible cookies
      secure: process.env.NODE_ENV === 'production', // Use true only in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/', // Ensure the cookie is available across the app
    });
    

    return new Response(JSON.stringify({ message: 'Login successful', token }), {
      status: 200,
      headers: { 'Set-Cookie': cookies },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Something went wrong', error: error.message }), { status: 500 });
  }
  

}
