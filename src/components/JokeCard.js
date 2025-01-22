import React from "react"; 
import LikeButton from "./LikeButton";

export default function JokeCard({ joke, userId, onLikeChange }) {
  const isLiked = joke.likes.includes(userId);

  const handleLike = () => {
    const updatedLikes = isLiked
      ? joke.likes.filter((id) => id !== userId)
      : [...joke.likes, userId];
    onLikeChange(joke._id, updatedLikes);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="border p-4 rounded mb-4 shadow-sm">
      <p className="text-lg">{joke.content}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-gray-500 text-sm">By: {joke.userName}</span>
        <span className="text-gray-500 text-sm">Created on: {formatDate(joke.createdAt)}</span>
        <span className="text-gray-500 text-sm">Likes: {joke.likes.length}</span>
        <LikeButton />
      </div>
    </div>
  );
}
