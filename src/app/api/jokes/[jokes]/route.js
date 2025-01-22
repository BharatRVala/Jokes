import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/model/User";

export async function GET(request, context) {
  try {
    // The 'uprofile' should be 'jokes' based on your route file name
    const { jokes } = context.params;

    if (!jokes) {
      return NextResponse.json(
        { success: false, message: "jokes parameter is missing" },
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
