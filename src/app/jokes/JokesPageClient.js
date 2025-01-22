"use client";

import { useState } from 'react';
import JokeCard from '@/components/JokeCard';
import Navbar from '@/components/Navbar';

export default function JokesPageClient({ jokes }) {
  const [jokesState, setJokesState] = useState(jokes);
  const userId = "user123"; // Replace with actual user ID logic (e.g., from session)

  const handleLikeChange = (jokeId, updatedLikes) => {
    // Update the jokes list with the new likes for the specific joke
    setJokesState((prev) =>
      prev.map((joke) =>
        joke._id === jokeId ? { ...joke, likes: updatedLikes } : joke
      )
    );
    console.log("Updated jokes state:", jokesState);

  };

  return (
    <div className="bg-white rounded-lg">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <h1 className="text-2xl text-blue-600 font-bold mb-4">All Jokes</h1>
        {jokesState.map((joke) => (
          <JokeCard
            key={joke._id}
            joke={joke}
            userId={userId}
            onLikeChange={handleLikeChange}
          />
        ))}
      </div>
    </div>
  );
}
