import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Joke from "@/models/joke";
import User from "@/models/user";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params; // Get user ID from URL
    console.log("🔍 Fetching user data for ID:", id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      console.log("⚠️ User not found");
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Fetch all jokes by the user
    const jokes = await Joke.find({ userId: id }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, user, jokes },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ API Error in /api/jokes/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
