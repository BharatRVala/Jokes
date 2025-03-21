"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProfileSkeleton from "@/components/ProfileSkeleton"; // Loading skeleton component
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Like & Dislike icons

const JokePage = () => {
  const { jokes } = useParams(); // Get user ID from URL
  const [user, setUser] = useState(null);
  const [userJokes, setUserJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jokes) return;

    const fetchUser = async () => {
      try {
        console.log("Fetching jokes for user:", jokes);
        const res = await fetch(`/api/jokes/${jokes}`);

        console.log("Response status:", res.status);

        if (!res.ok) {
          const errorData = await res.text();
          console.error("Error fetching user:", errorData);
          throw new Error("Failed to fetch user details");
        }

        const data = await res.json();
        console.log("User data received:", data);

        setUser(data.user);
        setUserJokes(data.user.jokes || []);
      } catch (err) {
        console.error("Fetch User Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [jokes]);

  // ✅ Handle Like Toggle
  const handleLike = async (jokeId) => {
    try {
      console.log("Liking joke ID:", jokeId);

      const res = await fetch("/api/jokes/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jokeId }),
      });

      console.log("Like API response status:", res.status);

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Error in like API:", errorData);
        throw new Error(errorData || "Failed to like the joke.");
      }

      const { joke } = await res.json();
      console.log("Updated joke after like:", joke);

      setUserJokes((prevJokes) => {
        const updatedJokes = prevJokes.map((j) =>
          j._id === joke._id ? joke : j
        );
        return [...updatedJokes]; // ✅ Force state update
      });
    } catch (err) {
      console.error("Like Error:", err.message);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        {loading ? (
          <ProfileSkeleton />
        ) : error ? (
          <div className="text-center text-red-600 font-bold mt-6">
            Error: {error}
          </div>
        ) : !user ? (
          <div className="text-center text-gray-600 font-bold mt-6">
            User not found.
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
              User Profile
            </h2>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-lg text-gray-700">
                <strong className="text-indigo-600">UserName:</strong> {user.userName}
              </p>
              <p className="text-lg text-gray-700">
                <strong className="text-indigo-600">Email:</strong> {user.email}
              </p>
            </div>

            <h2 className="text-2xl font-bold text-indigo-500 text-center mt-8">
              Jokes
            </h2>
            <div className="grid grid-cols-1 gap-6 mt-6">
              {userJokes.length > 0 ? (
                userJokes.map((joke) => {
                  const userLiked = joke.likes.includes(user?._id); // ✅ Check latest state

                  return (
                    <div
                      key={joke._id}
                      className="bg-yellow-100 p-4 rounded-lg shadow-md"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-md text-blue-500 font-semibold">@{user.userName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(joke.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <p className="text-lg italic text-gray-700 m-4">{joke.content}</p>

                      <div className="flex justify-between items-center">
                        {/* Like Button */}
                        <button
                          onClick={() => handleLike(joke._id)}
                          className="flex items-center space-x-2"
                        >
                          {userLiked ? (
                            <FaHeart className="text-red-500 text-xl" />
                          ) : (
                            <FaRegHeart className="text-gray-500 hover:text-red-500 text-xl" />
                          )}
                          <span className="text-lg font-bold text-gray-700">{joke.likes.length}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-xl text-gray-600 w-full col-span-3">
                  No jokes found.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JokePage;
