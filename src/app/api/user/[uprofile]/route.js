import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/model/User"; // Import your User model
import { Joke } from "@/lib/model/Joke"; // Ensure Joke model is imported if referenced

export async function GET(request, context) {
  try {
    // Await the `params` object from context
    const params = await context.params;

    if (!params || !params.uprofile) {
      return NextResponse.json(
        { success: false, message: "uprofile parameter is missing" },
        { status: 400 }
      );
    }

    const uprofile = params.uprofile;

    // Connect to the database
    await dbConnect();

    // Fetch user details from MongoDB
    const user = await User.findById(uprofile).populate("jokes"); // Ensure jokes schema is registered

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return user details
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
