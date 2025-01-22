'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar';

// Create Joke Page Component
export default function CreateJoke() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();

  const handlePublish = async () => {
    setError('');
    setSuccess('');
    setLoading(true); // Set loading to true when starting the request

    // Validate content
    if (!content.trim()) {
      setError('Joke content cannot be empty.');
      setLoading(false); // Stop loading if there's an error
      return;
    }

    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        setError('You must be logged in to publish jokes.');
        setLoading(false); // Stop loading if not logged in
        router.push('/login');
        return;
      }

      // Decode JWT to get user ID
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get user ID
      const userId = decodedToken.userId;

      // Send request to create the joke
      const response = await fetch('/api/jokes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, userId }), // Send both content and userId
      });

      // Handle the response
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to publish joke.');
      }

      const data = await response.json(); // Parse the JSON response
      setSuccess('Joke published successfully!');
      setContent(''); // Clear the textarea after successful publication
    } catch (error) {
      setError(error.message); // Set error message if request fails
    } finally {
      setLoading(false); // Stop loading once request is finished (success or failure)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl text-blue-600 font-bold mb-4">Create a Joke</h1>

        {/* Display error and success messages */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {/* Textarea for the joke content */}
        <textarea
          className="w-full p-3 border border-gray-300 rounded mb-4 bg-gray-100 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows="4"
          placeholder="Write your joke here..."
          value={content}
          onChange={(e) => setContent(e.target.value)} // Update content as user types
        ></textarea>

        {/* Publish button */}
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={handlePublish} // Trigger joke publish
          disabled={loading} // Disable the button while loading
        >
          {loading ? 'Publishing...' : 'Publish'} {/* Display loading text */}
        </button>
      </div>
    </div>
  );
}
