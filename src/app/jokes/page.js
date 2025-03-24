'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar';
import LikeButton from '@/components/LikeButton';
import JokesSkeleton from '@/components/JokesSkeleton'; // Skeleton loader component

export default function JokesPage() {
  const [jokes, setJokes] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voices, setVoices] = useState([]);
  const [category, setCategory] = useState('most-popular'); // Added category state
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (!token) {
      setError('You need to log in to view jokes.');
      router.push('/login');
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserId(decodedToken.userId);
    } catch (error) {
      setError('Invalid token. Please log in again.');
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const response = await fetch(`/api/alljokes?category=${category}`);
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
  }, [category]);

  const speakJoke = (text, language) => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported in your browser.");
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language === "hindi" ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8 mt-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
            Welcome to the Jokes Page!
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Enjoy the latest and funniest jokes shared by our users!
          </p>
          
          {/* Category Dropdown */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700">Filter by:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 p-2 border rounded-lg w-full bg-white shadow-md"
            >
              <option value="most-popular">Most Popular</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {loading ? (
          <JokesSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mt-12">
            {jokes.length === 0 ? (
              <p className="text-center text-xl text-gray-600 w-full col-span-3">
                No jokes available at the moment. Please check back later!
              </p>
            ) : (
              jokes.map((joke) => (
                <div key={joke._id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <p
                      className="text-md text-blue-500 font-semibold cursor-pointer"
                      onClick={() =>
                        joke.user?._id && router.push(`/jokes/${joke.user._id}`)
                      }
                    >
                      @{joke.userName || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(joke.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-lg italic text-gray-700 m-4">{joke.content}</p>

                  <div className="flex flex-col space-y-2">
                    <LikeButton
                      jokeId={joke._id}
                      initialLikes={joke.likedBy}
                      userId={userId}
                      onLikeChange={(jokeId, updatedLikes) =>
                        setJokes((prevJokes) =>
                          prevJokes.map((j) =>
                            j._id === jokeId ? { ...j, likedBy: updatedLikes } : j
                          )
                        )
                      }
                    />
                    <div className="flex space-x-4">
                      <button
                        onClick={() => speakJoke(joke.content, "english")}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                      >
                        Speak (English)
                      </button>
                      <button
                        onClick={() => speakJoke(joke.content, "hindi")}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-600 transition"
                      >
                        बोलो (Hindi)
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
