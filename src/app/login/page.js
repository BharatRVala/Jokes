"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token) {
      router.push("/home");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 200) {
        Cookies.set("auth_token", data.token, { expires: 1 });
        toast.success("Login successful!", { position: "top-right", autoClose: 2000 });
        setTimeout(() => {
          router.push("/home");
        }, 2500);
      } else {
        toast.error(data.message, { position: "top-right" });
      }
    } catch (err) {
      toast.error("Something went wrong", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen bg-gradient-to-br from-blue-300 via-purple-400 to-pink-500 text-white p-8 sm:p-20 gap-16 font-[var(--font-geist-sans)]">
      {/* Ensure ToastContainer is present */}
      <ToastContainer position="top-right" autoClose={2000} />
      
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <Image src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-200"
        >
          <h1 className="text-4xl font-semibold mb-6 text-yellow-300">Welcome Back!</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="mt-4 text-center">
            <p className="text-sm text-red-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
