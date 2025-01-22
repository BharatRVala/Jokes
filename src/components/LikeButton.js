'use client';

import { useState } from 'react';

const LikeButton = ({ jokeId, initialLikes, userId, onLikeChange }) => {
  const [likes, setLikes] = useState(initialLikes || []);
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = likes.includes(userId);

  const handleLike = async () => {
    if (!userId) {
      alert('You need to be logged in to like a joke.');
      return;
    }

    setIsLiking(true);

    try {
      const response = await fetch('/api/jokes/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jokeId, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setLikes(data.joke.likes);
        onLikeChange(jokeId, data.joke.likes);
      } else {
        alert(data.error || 'An error occurred while liking the joke.');
      }
    } catch (error) {
      console.error('Error liking the joke:', error);
      alert('An unexpected error occurred.');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button onClick={handleLike} disabled={isLiking} className="flex items-center space-x-2">
      <img
        src={isLiked ? '/heartp.png' : '/heart.png'}
        alt="Like"
        className="w-6 h-6"
      />
      <span className="font-semibold">{likes.length}</span>
    </button>
  );
};

export default LikeButton;
