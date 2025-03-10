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

    // Redirect to home page if user is already logged in
    if (token) {
      router.push('/home');
    }
  }, [router]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen bg-gradient-to-br from-blue-300 via-purple-400 to-pink-500 text-white p-8 sm:p-20 gap-16 font-[var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-4xl font-semibold mb-6 text-yellow-300">Welcome to the Funniest Jokes Site!</h1>

        <p className="text-lg font-[var(--font-geist-mono)] text-yellow-100">
          Ready to get your daily dose of laughs? We’ve got a joke for every moment.
        </p>
        <p className="text-md font-[var(--font-geist-mono)] text-yellow-200 mb-8">
          Sign up, log in, and start laughing with our huge collection of jokes.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/login"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-black gap-2 text-sm sm:text-base h-12 px-5 font-semibold"
          >
            Login to Get Started
          </Link>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm sm:text-base text-yellow-100">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}