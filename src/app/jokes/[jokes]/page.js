"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const UserPage = () => {
  const { jokes: userId } = useParams(); // Get user ID from URL
  const [user, setUser] = useState(null);
  const [userJokes, setUserJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        console.log("Fetching jokes for user:", userId);
        const res = await fetch(`/api/jokes/${userId}`);

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch user details: ${errorText}`);
        }

        const data = await res.json();
        if (!data.user) throw new Error("User not found");

        setUser(data.user);
        setUserJokes(data.user.jokes || []);
      } catch (err) {
        console.error("Fetch User Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const authToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth_token="))
          ?.split("=")[1];

        if (!authToken) return;

        const res = await fetch("/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch logged-in user");

        const data = await res.json();
        setCurrentUser(data.user);
      } catch (err) {
        console.error("Error fetching logged-in user:", err.message);
      }
    };

    fetchUser();
    fetchCurrentUser();
  }, [userId]);

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
                <strong className="text-indigo-600">UserName:</strong>{" "}
                {user.userName}
              </p>
              <p className="text-lg text-gray-700">
                <strong className="text-indigo-600">Email:</strong> {user.email}
              </p>
            </div>

            <h2 className="text-2xl font-bold text-indigo-500 text-center mt-8">
              Jokes
            </h2>
            <div className="grid grid-cols-1 gap-6 mt-6">
              {Array.isArray(userJokes) && userJokes.length > 0 ? (
                userJokes.map((joke) => {
                  const userLiked =
                    currentUser &&
                    Array.isArray(joke.likes) &&
                    joke.likes.includes(currentUser._id);

                  return (
                    <div
                      key={joke._id}
                      className="bg-yellow-100 p-4 rounded-lg shadow-md"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-md text-blue-500 font-semibold">
                          @{user.userName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(joke.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <p className="text-lg italic text-gray-700 m-4">
                        {joke.content}
                      </p>

                      <div className="flex justify-between items-center">
                        {/* Like Button with Animation */}
                        <button
                          onClick={() => handleLike(joke._id)}
                          className="flex items-center space-x-2"
                        >
                          <motion.div
                            whileTap={{ scale: 1.2 }}
                            animate={{ scale: userLiked ? [1, 1.2, 1] : 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {userLiked ? (
                              <FaHeart className="text-red-500 text-2xl" />
                            ) : (
                              <FaRegHeart className="text-gray-500 hover:text-red-500 text-2xl" />
                            )}
                          </motion.div>
                          <span className="text-lg font-bold text-gray-700">
                            {joke.likes?.length || 0}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-600 font-bold mt-6">
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

export default UserPage;
