'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar';
import LikeButton from '@/components/LikeButton';
import JokesSkeleton from '@/components/JokesSkeleton';

export default function JokesPage() {
  const [jokes, setJokes] = useState([]);
  const [allJokes, setAllJokes] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('most-popular');
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Filter jokes based on search term and category
  const filteredJokes = useMemo(() => {
    let result = [...allJokes];
    
    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      result = result.filter(joke => 
        joke.userName?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply category filter
    switch (category) {
      case 'most-popular':
        return result.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      case 'latest':
        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'my-jokes':
        return result.filter(joke => joke.user?._id === userId);
        default:
        return result;
    }
  }, [allJokes, search, category, userId]);

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
        setLoading(true);
        const response = await fetch('/api/alljokes');
        if (!response.ok) {
          throw new Error('Failed to fetch jokes');
        }
        const data = await response.json();
        setAllJokes(data.jokes);
        setJokes(data.jokes);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJokes();
  }, []);

  useEffect(() => {
    setJokes(filteredJokes);
  }, [filteredJokes]);

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

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border-2 border-blue-300 rounded-lg bg-white shadow-md 
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                        transition-all duration-200 text-gray-800 font-medium"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Filter by:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 p-3 border-2 border-purple-200 rounded-lg w-full bg-white shadow-md 
                        focus:border-purple-500 focus:ring-2 focus:ring-purple-200 
                        transition-all duration-200 text-gray-800 font-medium"
            >
              <option value="most-popular" className="bg-purple-100 text-purple-800">
                Most Popular
              </option>
              <option value="latest" className="bg-blue-100 text-blue-800">
                Latest
              </option>
              <option value="oldest" className="bg-green-100 text-green-800">
                Oldest
              </option>
              <option value="my-jokes" className="bg-yellow-100 text-yellow-800">
                My Jokes
              </option>
            </select>
          </div>
        </div>

        {loading ? (
          <JokesSkeleton />
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mt-12">
            {jokes.length === 0 ? (
              <div className="col-span-3 py-8 text-center">
                <p className="text-xl text-gray-600">
                  {category === 'my-jokes' 
                    ? "You haven't posted any jokes yet!" 
                    : search
                    ? "No jokes found matching your search"
                    : "No jokes available at the moment. Please check back later!"}
                </p>
              </div>
            ) : (
              jokes.map((joke) => (
                <div 
                  key={joke._id} 
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <p
                      className="text-md font-semibold text-purple-600 cursor-pointer hover:text-purple-800 transition-colors"
                      onClick={() =>
                        joke.user?._id && router.push(`/jokes/${joke.user._id}`)
                      }
                    >
                      @{joke.userName || 'Anonymous'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {new Date(joke.createdAt).toLocaleDateString()}
                      </span>
                      {/* <span className="text-sm font-semibold text-pink-600">
                        {joke.likeCount} likes
                      </span> */}
                    </div>
                  </div>

                  <p className="text-lg italic text-gray-700 mb-6">{joke.content}</p>

                  <div className="flex flex-col space-y-3">
                    <LikeButton
                      jokeId={joke._id}
                      initialLikes={joke.likes || []}
                      userId={userId}
                      onLikeChange={(jokeId, updatedLikes) => {
                        setAllJokes(prev => 
                          prev.map(j => 
                            j._id === jokeId 
                              ? { ...j, likes: updatedLikes, likeCount: updatedLikes.length } 
                              : j
                          )
                        );
                      }}
                    />
                    <div className="flex space-x-4">
                      <button
                        onClick={() => speakJoke(joke.content, "english")}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all"
                      >
                        Speak (English)
                      </button>
                      <button
                        onClick={() => speakJoke(joke.content, "hindi")}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-orange-600 hover:to-orange-700 transition-all"
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