"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Navbar from "@/components/Navbar";
import LikeButton from "@/components/LikeButton";

export default function JokesPage() {
  const [jokes, setJokes] = useState([]); // Ensure setJokes is correctly defined
  const [error, setError] = useState(null);
  const [loadingJokes, setLoadingJokes] = useState(true);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJokes = async () => {
      setLoadingJokes(true);
      try {
        const response = await fetch("/api/alljokes");
        if (!response.ok) {
          throw new Error("Failed to fetch jokes");
        }
        const data = await response.json();
        setJokes(data.jokes); // Ensure this updates the state correctly
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingJokes(false);
      }
    };

    fetchJokes();

    // Validate user token
    try {
      const token = Cookies.get("auth_token");
      if (!token) {
        setError("You must be logged in to view jokes.");
        router.push("/login");
        return;
      }
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.userId);
    } catch (error) {
      setError(error.message);
    }
  }, [router]);

  // Update jokes when like changes
  const handleLikeChange = (jokeId, updatedLikes) => {
    setJokes((prevJokes) =>
      prevJokes.map((joke) =>
        joke._id === jokeId ? { ...joke, likedBy: updatedLikes } : joke
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-purple-50">
      {/* Static Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-8 mt-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
            Welcome to the Jokes Page!
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Enjoy the latest and funniest jokes from our community:
          </p>
        </div>

        {/* Jokes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mt-12">
          {loadingJokes ? (
            <p className="text-center text-xl text-gray-600 w-full col-span-3">
              Loading jokes...
            </p>
          ) : jokes.length === 0 ? (
            <p className="text-center text-xl text-gray-600 w-full col-span-3">
              No jokes available. Please check back later!
            </p>
          ) : (
            jokes.map((joke) => (
              <div key={joke._id} className="bg-white p-2 rounded-lg shadow-md">
                {/* User Info */}
                <div className="flex justify-between items-center">
                  <p
                    className="text-md text-blue-500 font-semibold cursor-pointer"
                    onClick={() => {
                      const userId = joke.user?._id;
                      if (userId) {
                        router.push(`/jokes/${userId}`);
                      } else {
                        console.error("User ID is undefined");
                      }
                    }}
                  >
                    @{joke.userName || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(joke.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Joke Content */}
                <p className="text-lg italic text-gray-700 m-4">{joke.content}</p>

                {/* Like Button */}
                <LikeButton
                  jokeId={joke._id}
                  initialLikes={joke.likedBy}
                  userId={userId}
                  onLikeChange={handleLikeChange} // Ensure onLikeChange is passed correctly
                />
              </div>
            ))
          )}
        </div>

        {/* Footer Section */}
        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Jokes Platform. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
