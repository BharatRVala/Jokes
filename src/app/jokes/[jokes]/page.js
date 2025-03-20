"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import LikeButton from "@/components/LikeButton";

export default function JokesDetailsPage() {
  const { jokes: jokeId } = useParams(); // Get jokeId from URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/user/${jokeId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [jokeId]);

  const handleLikeChange = (jokeId, updatedLikes) => {
    setUserData((prev) => ({
      ...prev,
      jokes: prev.jokes.map((joke) =>
        joke._id === jokeId ? { ...joke, likes: updatedLikes } : joke
      ),
    }));
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!userData) return <p className="text-center text-red-500 font-semibold">User not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8 mt-12">
       

        {/* User Information Section */}
        <div className="bg-white p-6 mt-8 rounded-lg shadow-md border border-gray-300">
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Username:</span> {userData.userName}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Email:</span> {userData.email}
          </p>
        </div>

       

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {userData.jokes.length === 0 ? (
            <p className="text-center text-xl text-gray-600 w-full col-span-2">
              अभी कोई चुटकुले उपलब्ध नहीं हैं। कृपया बाद में वापस आएं!
            </p>
          ) : (
            userData.jokes.map((joke) => (
              <div key={joke._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <p className="text-md text-blue-500 font-semibold cursor-pointer">
                    @{userData.userName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(joke.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-lg italic text-gray-700 my-4">
                  {joke.content}
                </p>

                

                {/* Like Button */}
                <LikeButton
                  jokeId={joke._id}
                  initialLikes={joke.likes}
                  userId={user?.userId}
                  onLikeChange={handleLikeChange}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}