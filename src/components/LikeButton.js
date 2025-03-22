"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const LikeButton = ({ jokeId, initialLikes, userId, onLikeChange }) => {
  const [likes, setLikes] = useState(new Set(initialLikes)); // Using Set for quick lookup
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = likes.has(userId);

  const handleLike = async () => {
    if (!userId) {
      alert("You need to be logged in to like a joke.");
      return;
    }

    // Optimistic UI Update
    const updatedLikes = new Set(likes);
    if (isLiked) {
      updatedLikes.delete(userId);
    } else {
      updatedLikes.add(userId);
    }
    setLikes(updatedLikes);
    onLikeChange(jokeId, Array.from(updatedLikes));

    // Send API request in the background
    setIsLiking(true);
    try {
      const response = await fetch("/api/jokes/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jokeId, userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to like joke");

      // Sync UI with server response
      setLikes(new Set(data.joke?.likes || []));
      onLikeChange(jokeId, data.joke?.likes || []);
    } catch (error) {
      console.error("Error liking joke:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <>
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLike}
        disabled={isLiking}
        className="transition-transform transform active:scale-90"
      >
        <motion.div
          key={isLiked ? "liked" : "not-liked"} // Key to force re-render
          initial={{ scale: 1 }}
          animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }} // Bounce animation when liked
          transition={{ duration: 0.3 }}
        >
          <img
            src={isLiked ? "/heartp.png" : "/heart.png"}
            alt="Like"
            className="w-6 h-6"
          />
        </motion.div>
      </button>
  
      <span className="font-semibold text-black">{likes.size} likes</span>
    </div>
  </>
  
  );
};

export default LikeButton;