import React from "react";

export default function JokeCard({ joke, userId, onLikeChange }) {
  const isLiked = joke.likes.includes(userId);

  const handleLike = () => {
    const updatedLikes = isLiked
      ? joke.likes.filter((id) => id !== userId)
      : [...joke.likes, userId];
    onLikeChange(joke._id, updatedLikes);
  };

  return (
    <div className="border p-4 rounded mb-4 shadow-sm">
      <p className="text-lg">{joke.content}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-gray-500 text-sm">By: {joke.userName}</span>
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded ${
            isLiked ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {isLiked ? "Unlike" : "Like"} ({joke.likes.length})
        </button>
      </div>
    </div>
  );
}
