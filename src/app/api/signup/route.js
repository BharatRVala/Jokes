import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import { User } from '@/lib/model/User';

export async function POST(req) {
  try {
    const { userName, email, password } = await req.json();

    if (!userName) {
      return new Response(JSON.stringify({ message: 'UserName is required' }), { status: 400 });
    }

    if (!email) {
      return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
    }

    await dbConnect();

    // 🔒 Case-insensitive username check
    const existingUserByName = await User.findOne({
      userName: { $regex: new RegExp(`^${userName}$`, 'i') }
    });
    if (existingUserByName) {
      return new Response(JSON.stringify({ message: 'UserName already exists' }), { status: 409 });
    }

    // 🔒 Email check (default is case-insensitive)
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return new Response(JSON.stringify({ message: 'Email already exists' }), { status: 409 });
    }

    // 🔒 Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
    if (!passwordRegex.test(password)) {
      return new Response(
        JSON.stringify({
          message:
            'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 5 characters long.',
        }),
        { status: 400 }
      );
    }

    // ✅ Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, email, password: hashedPassword });

    return new Response(JSON.stringify({ message: 'Signup successful', user }), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500 }
    );
  }
}
