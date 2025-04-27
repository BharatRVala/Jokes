'use client';

import { useEffect } from "react"; // Added import for useEffect
import { useRouter } from "next/navigation"; // Added import for useRouter
import Image from "next/image";
import Link from "next/link";
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter(); // Initializing router

  useEffect(() => {
    const token = Cookies.get('auth_token');

    
    if (token) {
      router.push('/home');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-purple-50 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 py-8 mt-0">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Welcome to Jokes Platform!</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Enjoy our collection of fun jokes! Here are a few to start with:
          </p>

          {/* Jokes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[  
              { question: "Why don’t skeletons fight each other?", answer: "Because they don’t have the guts! 💀😂" },
              { question: "Why did the scarecrow win an award?", answer: "He was outstanding in his field! 🌾🏆" },
              { question: "Why don’t scientists trust atoms?", answer: "Because they make up everything! ⚛️🤣" },
              { question: "Why did the math book look sad?", answer: "It had too many problems! 📘😭" },
              { question: "Why couldn’t the bicycle stand up by itself?", answer: "It was two tired! 🚲😴" }
            ].map((joke, index) => (
              <div key={index} className="bg-blue-100 p-4 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">{index + 1}️⃣ {joke.question}</h3>
                <p className="text-gray-700 mb-4">{joke.answer}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push('/login')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Login to Read More Jokes
          </button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[  
            { img: "/pen-clip.png", title: "Create Jokes", desc: "Share your sense of humor by creating hilarious jokes and sharing them with the community.", color: "bg-blue-100 text-blue-600" },
            { img: "/mouse-pointer-heart.png", title: "Like Jokes", desc: "React to jokes you love! Like jokes to show appreciation and keep the laughter flowing.", color: "bg-purple-100 text-purple-600" },
            { img: "/user-pen.png", title: "Profile Management", desc: "Update your profile, edit or delete jokes, and manage your account with ease.", color: "bg-pink-100 text-pink-600" },
            { img: "/edit.png", title: "Edit/Delete Jokes", desc: "Modify your jokes for better punchlines or delete them if you change your mind.", color: "bg-yellow-100 text-yellow-600" },
            { img: "/user-xmark.png", title: "Delete Account", desc: "Take control of your account. Delete your profile anytime with a single click.", color: "bg-red-100 text-red-600" }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center ${feature.color} rounded-full`}>
                <img src={feature.img} alt={feature.title} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Jokes Platform. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}