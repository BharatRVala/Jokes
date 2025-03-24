"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function CreateJoke() {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePublish = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (!content.trim()) {
      setError("Joke content cannot be empty.");
      setLoading(false);
      return;
    }

    if (!user || !user.userId) {
      setError("You must be logged in to publish jokes.");
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/jokes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, userId: user.userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to publish joke.");
      }

      setSuccess("Joke published successfully!");
      setContent("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl text-blue-600 font-bold mb-4">Create a Joke</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <textarea
          className="w-full p-3 border border-gray-300 rounded mb-4 bg-gray-100 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows="4"
          placeholder="Write your joke here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={handlePublish}
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
