'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function Signup() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) router.push('/home');
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userName) {
      toast.error('UserName is required.');
      setLoading(false);
      return;
    }

    if (!email) {
      toast.error('Email is required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, email, password }),
      });

      const data = await res.json();

      if (res.status === 201) {
        toast.success('Signup successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error(data.message || 'Signup failed.');
      }
    } catch (err) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen bg-gradient-to-br from-blue-300 via-purple-400 to-pink-500 text-white p-8 sm:p-20 gap-16">
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
       

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-200"
        >
          <h1 className="text-4xl font-semibold mb-6 text-yellow-300">Create an Account</h1>

          <input
            type="text"
            placeholder="UserName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-green-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-green-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg text-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-green-800">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                Login
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
