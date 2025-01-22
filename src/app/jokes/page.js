"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar';
import LikeButton from '@/components/LikeButton';

export default function JokesPage() {
  const [jokes, setJokes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const response = await fetch('/api/alljokes');
        if (!response.ok) {
          throw new Error('Failed to fetch jokes');
        }
        const data = await response.json();
        setJokes(data.jokes);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJokes();

    // Token validation for user authentication
    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        setError('You must be logged in to view jokes.');
        setLoading(false);
        router.push('/login');
        return;
      }
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      setUserId(decodedToken.userId);
    } catch (error) {
      setError(error.message);
    }
  }, [router]);

  const handleLikeChange = (jokeId, updatedLikes) => {
    setJokes((prevJokes) =>
      prevJokes.map((joke) =>
        joke._id === jokeId ? { ...joke, likedBy: updatedLikes } : joke
      )
    );
  };

  // Display loading, error, or jokes depending on the state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading jokes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8 mt-12">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Welcome to the Jokes Page!</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Enjoy the latest and funniest jokes from our community:
          </p>
        </div>

        {/* Jokes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mt-12">
          {jokes.length === 0 ? (
            <p className="text-center text-xl text-gray-600 w-full col-span-3">No jokes available. Please check back later!</p>
          ) : (
            jokes.map((joke) => (
              <div key={joke._id} className="bg-white p-2 rounded-lg shadow-md ">
                {/* User Name at the Top with Clickable Link */}
                <div className="flex justify-between items-center">
                  <p
                    className="text-md text-blue-500 font-semibold   cursor-pointer"
                    onClick={() => {
                      const userId = joke.user?._id;  // Adjust this according to your joke object structure
                      if (userId) {
                        router.push(`/jokes/${userId}`);
                      } else {
                        console.error("User ID is undefined");
                      }
                    }}
                  >
                    @{joke.userName || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-500">{new Date(joke.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Joke Content */}
                <p className="text-lg italic text-gray-700 m-4">{joke.content}</p>

                {/* Like Button */}
                <LikeButton
                  jokeId={joke._id}
                  initialLikes={joke.likedBy}
                  userId={userId}
                  onLikeChange={handleLikeChange}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer Section */}
        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Jokes Platform. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
