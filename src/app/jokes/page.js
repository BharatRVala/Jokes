"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Navbar from "@/components/Navbar";
import LikeButton from "@/components/LikeButton";

export default function JokesPage() {
  const [jokes, setJokes] = useState([]);
  const [error, setError] = useState(null);
  const [loadingJokes, setLoadingJokes] = useState(true);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (!token) {
      setError("आपको चुटकुले देखने के लिए लॉग इन करना होगा।");
      router.push("/login");
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.userId);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    const fetchJokes = async () => {
      setLoadingJokes(true);
      try {
        const response = await fetch("/api/alljokes");
        if (!response.ok) {
          throw new Error("Failed to fetch jokes");
        }
        const data = await response.json();
        setJokes(data.jokes);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingJokes(false);
      }
    };

    fetchJokes();
  }, []);

  const handleLikeChange = (jokeId, updatedLikes) => {
    setJokes((prevJokes) =>
      prevJokes.map((joke) =>
        joke._id === jokeId ? { ...joke, likedBy: updatedLikes } : joke
      )
    );
  };

  const readJoke = async (joke, lang) => {
    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support text-to-speech.");
      return;
    }

    let text = joke;
    if (lang === "hi-IN") {
      try {
        const response = await fetch("/api/translateJoke", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ joke }),
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.translatedJoke) {
          throw new Error("Translation failed, no data received.");
        }
        text = data.translatedJoke;
      } catch (error) {
        console.error("Error translating joke:", error);
        alert("चुटकुला ट्रांसलेट करने में समस्या हुई। कृपया पुनः प्रयास करें।");
        return;
      }
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = lang;
    speech.rate = 0.9;
    speech.pitch = 1.2; // Slightly higher pitch for a more feminine voice

    speechSynthesis.onvoiceschanged = () => {
      const voices = speechSynthesis.getVoices();
      console.log("Available voices:", voices);

      if (lang === "hi-IN") {
        const hindiFemaleVoice = voices.find(
          (voice) => voice.lang === "hi-IN" && voice.name.includes("Female")
        );
        if (hindiFemaleVoice) {
          speech.voice = hindiFemaleVoice;
        } else {
          console.warn("No Hindi female voice found, using default.");
        }
      }

      window.speechSynthesis.speak(speech);
    };

    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      speechSynthesis.onvoiceschanged();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8 mt-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
            चुटकुलों के पेज में आपका स्वागत है!
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            हमारे समुदाय से नवीनतम और सबसे मजेदार चुटकुलों का आनंद लें:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mt-12">
          {loadingJokes ? (
            <p className="text-center text-xl text-gray-600 w-full col-span-3">
              चुटकुले लोड हो रहे हैं...
            </p>
          ) : jokes.length === 0 ? (
            <p className="text-center text-xl text-gray-600 w-full col-span-3">
              अभी कोई चुटकुले उपलब्ध नहीं हैं। कृपया बाद में वापस आएं!
            </p>
          ) : (
            jokes.map((joke) => (
              <div key={joke._id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <p
                    className="text-md text-blue-500 font-semibold cursor-pointer"
                    onClick={() => joke.user?._id && router.push(`/jokes/${joke.user._id}`)}
                  >
                    @{joke.userName || "गुमनाम"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(joke.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-lg italic text-gray-700 m-4">{joke.content}</p>

                <button
                  onClick={() => readJoke(joke.content, "hi-IN")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition mr-2"
                >
                  चुटकुला सुनें (हिंदी)
                </button>

                <button
                  onClick={() => readJoke(joke.content, "en-US")}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                >
                  Hear Joke (English)
                </button>

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
      </div>
    </div>
  );
}
