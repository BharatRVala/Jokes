"use client";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function MyJokes({ jokes, handleEditJoke, handleDeleteJoke }) {
  const { user } = useContext(AuthContext);
  const [jokeList, setJokeList] = useState(jokes || []);

  useEffect(() => {
    setJokeList(jokes);
  }, [jokes]);

  const handleLike = async (jokeId) => {
    if (!user || !user.userId) {
      alert("You need to be logged in to like a joke.");
      return;
    }

    // Optimistically update the UI
    setJokeList((prevJokes) =>
      prevJokes.map((joke) =>
        joke._id === jokeId
          ? {
              ...joke,
              likes: joke.likes.includes(user.userId)
                ? joke.likes.filter((id) => id !== user.userId)
                : [...joke.likes, user.userId],
            }
          : joke
      )
    );

    try {
      const response = await fetch("/api/jokes/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jokeId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to like joke");

      // Update state based on server response
      setJokeList((prevJokes) =>
        prevJokes.map((joke) =>
          joke._id === jokeId ? { ...joke, likes: data.joke.likes } : joke
        )
      );
    } catch (error) {
      console.error("Error liking joke:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold text-gray-700 mb-4">
        Your Jokes ({jokeList.length})
      </h3>
      <div>
        {jokeList.length === 0 ? (
          <p>No jokes available.</p>
        ) : (
          jokeList.map((joke) => (
            <div
              key={joke._id}
              className="p-4 mb-4 bg-yellow-100 text-gray-800 rounded-lg shadow-md"
            >
              <p>{joke.content}</p>
              <p className="text-sm text-gray-500">
                Posted on: {new Date(joke.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-2 flex justify-between items-center">
                {/* Like Button */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLike(joke._id)}
                    className="flex items-center space-x-2 transition-transform transform active:scale-90"
                  >
                    <motion.div
                      key={joke.likes.includes(user?.userId) ? "liked" : "not-liked"}
                      initial={{ scale: 1 }}
                      animate={{
                        scale: joke.likes.includes(user?.userId) ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {joke.likes.includes(user?.userId) ? (
                        <FaHeart className="text-red-500 text-2xl" />
                      ) : (
                        <FaRegHeart className="text-gray-500 hover:text-red-500 text-2xl" />
                      )}
                    </motion.div>
                  </button>
                  <span className="font-semibold text-black">
                    {joke.likes.length} likes
                  </span>
                </div>

                {/* Edit & Delete Buttons */}
                <div className="flex space-x-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleEditJoke(joke)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDeleteJoke(joke._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
