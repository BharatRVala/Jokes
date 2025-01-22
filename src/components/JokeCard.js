import { useState, useEffect } from 'react'; // Add this import
import Link from 'next/link';
import LikeButton from './LikeButton';

const JokeCard = ({ joke, userId, onLikeChange }) => {
  const [createdDate, setCreatedDate] = useState('');

  useEffect(() => {
    // Ensure the date format is set properly on the client side
    const formattedDate = new Date(joke.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    setCreatedDate(formattedDate);
  }, [joke.createdAt]); // Recalculate if joke.createdAt changes

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#e3f2fd', // Light blue background
        marginBottom: '15px',
        borderRadius: '10px',
        border: '1px solid #90caf9', // Blue border
        color: '#1e88e5', // Blue text color
        position: 'relative', // Relative positioning to place date at the top-right
      }}
    >
      {/* Username as a clickable link */}
      <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        <Link
          href={`/jokes/${joke.user?._id}`} // Navigate to jokes/[jokes] with userId
          style={{ textDecoration: 'none', color: '#0d47a1' }} // Link style
        >
          @{joke.user?.userName || 'Unknown User'}
        </Link>
      </p>

      {/* Creation date in the top-right corner */}
      <p
        style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          fontSize: '12px',
          color: '#424242',
        }}
      >
        {createdDate}
      </p>

      {/* Joke content */}
      <p style={{ marginBottom: '10px', color: '#424242' }}>{joke.content}</p>

      {/* Like button */}
      <LikeButton
        jokeId={joke._id}
        initialLikes={joke.likes}
        userId={userId}
        onLikeChange={onLikeChange}
      />
    </div>
  );
};

export default JokeCard;
