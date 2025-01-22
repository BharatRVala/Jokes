// src/app/api/user/route.js

import { dbConnect } from '@/lib/db';
import { User } from '@/lib/model/User';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ message: 'Authorization header missing or invalid' }),
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ message: 'Token missing' }), { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }

    await dbConnect();

    // Fetch the user from the database
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ user }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500 }
    );
  }
}
