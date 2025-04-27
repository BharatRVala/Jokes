import { dbConnect } from '@/lib/db';
import { User } from '@/lib/model/User';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    await dbConnect(); // Ensure DB connection

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error("Authorization header missing or invalid");
      return new Response(
        JSON.stringify({ message: 'Authorization header missing or invalid' }),
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error("Token missing in authorization header");
      return new Response(JSON.stringify({ message: 'Token missing' }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.error("Invalid token provided");
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      console.error("User not found with ID:", decoded.userId);
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
    console.error("Error fetching user data:", error);
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500 }
    );
  }
}
