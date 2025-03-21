"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import LikeButton from "@/components/LikeButton";
import ProfileSkeleton from "@/components/ProfileSkeleton"; // Loading skeleton component

const JokePage = () => {
  const { jokes } = useParams(); // Use useParams for dynamic route parameters
  const [user, setUser] = useState(null);
  const [userJokes, setUserJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jokes) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/jokes/${jokes}`); // Fetch user by ID
        if (!res.ok) throw new Error("Failed to fetch user details");

        const data = await res.json();
        setUser(data.user);
        setUserJokes(data.user.jokes || []); // Store jokes in state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [jokes]);

  // ✅ Fix: Update jokes list when a like is added/removed
  const handleLikeChange = (jokeId, updatedLikes) => {
    setUserJokes((prevJokes) =>
      prevJokes.map((joke) =>
        joke._id === jokeId ? { ...joke, likes: updatedLikes } : joke
      )
    );
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
                userJokes.map((joke) => (
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
                      {/* ✅ Fixed: Pass onLikeChange */}
                      <LikeButton
                        jokeId={joke._id}
                        initialLikes={joke.likes}
                        userId={user._id}
                        onLikeChange={handleLikeChange} // ✅ Pass this function
                      />
                    </div>
                  </div>
                ))
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
