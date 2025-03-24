'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8 mt-12">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Welcome to Jokes Platform!</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Enjoy our collection of fun jokes! Here are a few to start with:
          </p>

          {/* Jokes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">1️⃣ Why don’t skeletons fight each other?</h3>
              <p className="text-gray-700 mb-4">Because they don’t have the guts! 💀😂</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">2️⃣ Why did the scarecrow win an award?</h3>
              <p className="text-gray-700 mb-4">He was outstanding in his field! 🌾🏆</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">3️⃣ Why don’t scientists trust atoms?</h3>
              <p className="text-gray-700 mb-4">Because they make up everything! ⚛️🤣</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">4️⃣ Why did the math book look sad?</h3>
              <p className="text-gray-700 mb-4">It had too many problems! 📘😭</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">5️⃣ Why couldn’t the bicycle stand up by itself?</h3>
              <p className="text-gray-700 mb-4">It was two tired! 🚲😴</p>
            </div>
          </div>

          <button
            onClick={() => router.push('/jokes')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Read More Jokes
          </button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Feature 1: Create Jokes */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <img src="/pen-clip.png" alt="Create Jokes" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Create Jokes</h3>
            <p className="text-gray-600 mt-2">
              Share your sense of humor by creating hilarious jokes and sharing them with the community.
            </p>
          </div>

          {/* Feature 2: Like Jokes */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full">
              <img src="/mouse-pointer-heart.png" alt="Like Jokes" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Like Jokes</h3>
            <p className="text-gray-600 mt-2">
              React to jokes you love! Like jokes to show appreciation and keep the laughter flowing.
            </p>
          </div>

          {/* Feature 3: Profile Management */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full">
              <img src="/user-pen.png" alt="Edit Profile" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Profile Management</h3>
            <p className="text-gray-600 mt-2">
              Update your profile, edit or delete jokes, and manage your account with ease.
            </p>
          </div>

          {/* Feature 4: Edit/Delete Jokes */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full">
              <img src="/edit.png" alt="Edit/Delete Jokes" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Edit/Delete Jokes</h3>
            <p className="text-gray-600 mt-2">
              Modify your jokes for better punchlines or delete them if you change your mind.
            </p>
          </div>

          {/* Feature 5: Delete Account */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
              <img src="/user-xmark.png" alt="Delete Account" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Delete Account</h3>
            <p className="text-gray-600 mt-2">
              Take control of your account. Delete your profile anytime with a single click.
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Jokes Platform. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}