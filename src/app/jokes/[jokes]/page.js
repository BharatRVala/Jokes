'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LikeButton from '@/components/LikeButton';

const JokePage = () => {
  const { jokes } = useParams(); // Use useParams for dynamic route parameters

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jokes) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/jokes/${jokes}`); // Fetch user by ID
        if (!res.ok) throw new Error('Failed to fetch user details');

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [jokes]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found.</div>;

  // Function to format the creation date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const onLikeChange = (jokeId) => {
    const updatedJokes = user.jokes.map((joke) => {
      if (joke._id === jokeId) {
        joke.likes += 1;
      }
      return joke;
    });
    setUser((prevUser) => ({ ...prevUser, jokes: updatedJokes }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <h1 className="text-2xl font-bold text-indigo-600 mb-4">User Details</h1>
        <p className="text-lg text-gray-700">
          <strong className="text-indigo-600">UserName:</strong> {user.userName}
        </p>
        <p className="text-lg text-gray-700">
          <strong className="text-indigo-600">Email:</strong> {user.email}
        </p>
        <h2 className="text-xl font-semibold text-indigo-500 mt-6">Jokes</h2>
        <div className="mt-4">
          {user.jokes?.length > 0 ? (
            user.jokes.map((joke) => (
              <div key={joke._id} className="mb-6 p-4 border-b border-gray-300">
                <p className="text-lg text-gray-800">{joke.content}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    Created on: {formatDate(joke.createdAt)}
                  </p>
                  <LikeButton
                    jokeId={joke._id}
                    initialLikes={joke.likes}
                    userId={user._id}
                    onLikeChange={onLikeChange}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No jokes found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JokePage;
