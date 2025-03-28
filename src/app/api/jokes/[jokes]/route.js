import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/model/User";

export async function GET(req, context) {
  try {
    const params = await context.params; 
    const { jokes } = params;

    if (!jokes) {
      return NextResponse.json(
        { success: false, message: "Jokes parameter is missing" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch the user based on the dynamic 'jokes' ID
    const user = await User.findById(jokes).populate("jokes");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}