import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/model/User";

export async function GET(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;  // ✅ Await the params

    const user = await User.findById(id).populate("jokes");
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
