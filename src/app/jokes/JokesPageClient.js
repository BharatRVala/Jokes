import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar"; // Adjust the import path for Navbar if necessary
import JokeCard from "@/components/JokeCard";

export default function ClientPage() {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporarily use mock data for jokes
  useEffect(() => {
    const mockJokes = [
      { _id: "1", content: "Why don't programmers like nature? It has too many bugs.", likes: [] },
      { _id: "2", content: "Why do programmers prefer dark mode? Because light attracts bugs!", likes: [] },
    ];
    setJokes(mockJokes);
    setLoading(false);
  }, []);

  const handleLikeChange = (jokeId, updatedLikes) => {
    setJokes((prevJokes) =>
      prevJokes.map((joke) =>
        joke._id === jokeId ? { ...joke, likes: updatedLikes } : joke
      )
    );
  };

  return (
    <div className="bg-white rounded-lg">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <h1 className="text-2xl text-blue-600 font-bold mb-4">All Jokes</h1>
        {loading ? (
          <p className="text-gray-500">Loading jokes...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : jokes.length === 0 ? (
          <p className="text-gray-500">No jokes to display.</p>
        ) : (
          jokes.map((joke) => (
            <JokeCard
              key={joke._id}
              joke={joke}
              userId="user123" // Replace with dynamic user ID if needed
              onLikeChange={handleLikeChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
