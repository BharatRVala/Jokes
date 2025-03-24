'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-400 to-pink-500 text-white p-8 sm:p-20 gap-16 font-[var(--font-geist-sans)]">
      <main className="max-w-5xl mx-auto text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-yellow-300 mb-4">Welcome to Jokes Platform!</h1>
        <p className="text-lg text-yellow-100 leading-relaxed mb-8">
          Ready to get your daily dose of laughs? Sign up, log in, and start enjoying hilarious jokes.
        </p>

        {/* Jokes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center text-black">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Why don’t skeletons fight each other?</h3>
            <p className="text-gray-700">Because they don’t have the guts! 💀😂</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center text-black">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Why did the scarecrow win an award?</h3>
            <p className="text-gray-700">He was outstanding in his field! 🌾🏆</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center text-black">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Why don’t scientists trust atoms?</h3>
            <p className="text-gray-700">Because they make up everything! ⚛️🤣</p>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <Link
            href="/jokes"
            className="rounded-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 shadow-md transition"
          >
            Read More Jokes
          </Link>
        </div>
      </main>

      <footer className="mt-16 text-center text-yellow-100">
        <p>&copy; {new Date().getFullYear()} Jokes Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
