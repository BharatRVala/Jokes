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
  const router = useRouter();

  // Fetch user ID from the token
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

  // Fetch jokes from the API
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
  }, []);

  // Handle like changes
  const handleLikeChange = (jokeId, updatedLikes) => {
    setJokes((prevJokes) =>
      prevJokes.map((joke) =>
        joke._id === jokeId ? { ...joke, likedBy: updatedLikes } : joke
      )
    );
  };

  // Load available voices for speech synthesis
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log("Available Voices:", availableVoices); // Debugging
      setVoices(availableVoices);
    };

    // Load voices initially
    loadVoices();

    // Add event listener for voices changed
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Function to select the appropriate voice
  const getVoice = (language) => {
    if (!voices.length) return null;

    if (language === "hindi") {
      // Try to find a female Hindi voice
      const hindiFemaleVoice = voices.find(
        (voice) => voice.lang.includes("hi-IN") && voice.name.toLowerCase().includes("female")
      );

      if (!hindiFemaleVoice) {
        alert(
          "🚨 Hindi Female voice is not supported in your browser!\n\n" +
          "To enable Hindi Female voice, follow these steps:\n\n" +
          "For Android Devices:\n" +
          "1. Install Google Text-to-Speech from the Play Store.\n" +
          "2. Download the Hindi voice pack in the app.\n" +
          "3. Set Hindi as the default language in Settings > Language & Input > Text-to-Speech Output.\n\n" +
          "For iOS Device:\n" +
          "1. Go to Settings > Accessibility > Spoken Content > Voices.\n" +
          "2. Download the Hindi voice.\n" +
          "3. Set Hindi as the preferred language in Settings > General > Language & Region.\n\n" +
          "For Desktop Users:\n" +
          "1. Install the Hindi voice on your operating system.\n" +
          "2. Restart your browser.\n\n" +
          "For detailed instructions, visit our support page."
        );
        return null;
      }

      return hindiFemaleVoice;
    } else {
      // Fallback to English voice
      return voices.find((voice) => voice.lang.includes("en-US"));
    }
  };

  // Function to speak the joke in English or Hindi
  const speakJoke = (text, language) => {
    if (!window.speechSynthesis) {
      alert(
        "Speech synthesis is not supported in your browser.\n\n" +
        "Please use Google Chrome or a supported mobile browser."
      );
      return;
    }

    const selectedVoice = getVoice(language);
    if (!selectedVoice) return;

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language === "hindi" ? "hi-IN" : "en-US";
    speech.voice = selectedVoice;
    speech.rate = 0.9; // Adjust speed if needed
    window.speechSynthesis.speak(speech);
  };

  // Function to fetch translated joke and then speak it in Hindi
  const speakJokeInHindi = async (joke) => {
    try {
      const response = await fetch('/api/transletjokes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joke }),
      });

      if (!response.ok) throw new Error('Translation API failed');

      const data = await response.json();
      if (!data.translatedJoke) throw new Error('No translation received');

      speakJoke(data.translatedJoke, "hindi");
    } catch (error) {
      console.error('Translation error:', error);
      alert('Failed to translate joke. Please try again later.');
    }
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
                      onLikeChange={handleLikeChange}
                    />

                    <div className="flex space-x-4">
                      {/* Speak Joke Buttons */}
                      <button
                        onClick={() => speakJoke(joke.content, "english")}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                      >
                        Speak (English)
                      </button>
                      <button
                        onClick={() => speakJokeInHindi(joke.content)}
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