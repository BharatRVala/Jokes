import { dbConnect } from "@/lib/db";
import { Joke } from "@/lib/model/Joke"; // ✅ Corrected import
import { User } from "@/lib/model/User";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { jokeId } = params;

    console.log("Fetching likes for joke:", jokeId);

    // ✅ Ensure jokeId is valid before querying MongoDB
    if (!jokeId) {
      return new Response(JSON.stringify({ error: "Invalid joke ID" }), { status: 400 });
    }

    // ✅ Fetch joke and populate 'likes' with user details
    const joke = await Joke.findById(jokeId).populate("likes", "userName email");

    if (!joke) {
      console.error("Joke not found:", jokeId);
      return new Response(JSON.stringify({ error: "Joke not found" }), { status: 404 });
    }

    console.log("Likes fetched:", joke.likes);
    return new Response(JSON.stringify({ users: joke.likes }), { status: 200 });
  } catch (error) {
    console.error("Error fetching likes:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
