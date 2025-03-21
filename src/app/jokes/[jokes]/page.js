"use client";
import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

export default function JokesDetailsPage() {
  const { jokes: jokeId } = useParams(); // Get jokeId from URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Get logged-in user from context
  const [likedJokes, setLikedJokes] = useState(new Set());

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/user/${jokeId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData(data);
        setLikedJokes(new Set(data.jokes.filter(j => j.likes.includes(user?.userId)).map(j => j._id)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [jokeId, user]);

  const toggleLike = async (jokeId) => {
    if (!user) {
      alert("You need to be logged in to like jokes.");
      return;
    }

    const isLiked = likedJokes.has(jokeId);
    const updatedLikes = new Set(likedJokes);
    isLiked ? updatedLikes.delete(jokeId) : updatedLikes.add(jokeId);
    setLikedJokes(updatedLikes);
    
    try {
      const response = await fetch("/api/jokes/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jokeId }),
      });

      if (!response.ok) throw new Error("Failed to update like status");

      const data = await response.json();
      setUserData((prev) => ({
        ...prev,
        jokes: prev.jokes.map((joke) =>
          joke._id === jokeId ? { ...joke, likes: data.joke.likes } : joke
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!userData)
    return <p className="text-center text-red-500 font-semibold">User not found</p>;

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">User Details</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Username:</span> {userData.userName}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Email:</span> {userData.email}
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-6 text-gray-900">User Jokes</h2>

      {userData.jokes.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {userData.jokes.map((joke) => (
            <div key={joke._id} className="p-4 bg-blue-50 border border-blue-300 rounded-lg shadow-md">
              <p className="text-gray-800 font-medium">{joke.content}</p>
              <p className="text-gray-600 text-sm mt-2">
                Published on: {" "}
                <span className="font-semibold">
                  {new Date(joke.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
              <p className="text-gray-700 text-sm mt-2 flex items-center gap-2">
                <motion.button
                  onClick={() => toggleLike(joke._id)}
                  animate={{ scale: likedJokes.has(joke._id) ? [1.3, 1] : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <FaHeart
                    className={
                      likedJokes.has(joke._id) ? "text-red-500" : "text-gray-400"
                    }
                    size={24}
                  />
                </motion.button>
                <span className="font-semibold">{joke.likes.length}</span> Likes
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">No jokes available.</p>
      )}
    </div>
  );
}