'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [jokes, setJokes] = useState([]);
  const [editJokeModal, setEditJokeModal] = useState(false);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [selectedJoke, setSelectedJoke] = useState(null);
  const [editedJokeContent, setEditedJokeContent] = useState('');
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [jokeError, setJokeError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Add state for delete confirmation
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth_token');

    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setEditedName(data.user.userName);
          setEditedEmail(data.user.email);

          const jokesRes = await fetch('/api/myjokes', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (jokesRes.ok) {
            const jokesData = await jokesRes.json();
            setJokes(jokesData.jokes);
          } else {
            setError('Failed to fetch jokes.');
          }
        } else {
          setError('Failed to fetch user data.');
        }
      } catch (err) {
        setError('Something went wrong.');
      }
    };

    fetchUserData();
  }, [router]);

  const handleEditJoke = (joke) => {
    setSelectedJoke(joke);
    setEditedJokeContent(joke.content);
    setEditJokeModal(true);
    setJokeError('');
  };

  const handleUpdateJoke = async () => {
    setJokeError('');
    const token = Cookies.get('auth_token');

    if (!editedJokeContent.trim()) {
      setJokeError('Joke content cannot be empty.');
      return;
    }

    try {
      const res = await fetch('/api/jokes/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jokeId: selectedJoke._id,
          userId: user._id,
          content: editedJokeContent,
        }),
      });

      if (res.ok) {
        const updatedJoke = await res.json();
        setJokes((prev) =>
          prev.map((joke) => (joke._id === updatedJoke._id ? updatedJoke : joke))
        );
        setEditJokeModal(false);
      } else {
        const data = await res.json();
        setJokeError(data.error || 'Failed to update the joke.');
      }
    } catch (err) {
      setJokeError('An error occurred. Please try again.');
    }
  };

  const handleDeleteJoke = async (jokeId) => {
    const token = Cookies.get('auth_token');
  
    try {
      const res = await fetch('/api/jokes/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jokeId,   // ID of the joke to delete
          userId: user._id,  // ID of the logged-in user
        }),
      });
  
      if (res.ok) {
        setJokes((prev) => prev.filter((joke) => joke._id !== jokeId));
      } else {
        const data = await res.json();
        setDeleteError(data.error || 'Failed to delete the joke.');
      }
    } catch (err) {
      setDeleteError('An error occurred. Please try again.');
    }
  };
  

  const handleUpdateProfile = async () => {
    const token = Cookies.get('auth_token');

    try {
      const res = await fetch('/api/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          userName: editedName,
          email: editedEmail,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setEditProfileModal(false);
        setMessage('Profile updated successfully!');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError('An error occurred while updating your profile.');
    }
  };

  const handleDeleteAccount = async () => {
    const token = Cookies.get('auth_token');

    try {
      const res = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        Cookies.remove('auth_token');
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete account.');
      }
    } catch (err) {
      setError('An error occurred while deleting your account.');
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">User Profile</h2>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* User Info */}
        <div className="mb-6">
          <p className="text-lg text-blue-600">
            <strong>UserName:</strong> {user?.userName || 'N/A'}
          </p>
          <p className="text-lg text-green-600">
            <strong>Email:</strong> {user?.email || 'N/A'}
          </p>
        </div>

        {/* Profile Actions */}
        <div className="flex space-x-4 mb-8">
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            onClick={() => setEditProfileModal(true)}
          >
            Edit Profile
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => setShowDeleteConfirm(true)} // Show delete confirmation modal
          >
            Delete Account
          </button>
        </div>

        {/* Jokes Section */}
        <h3 className="text-xl font-bold text-gray-700 mb-4">Your Jokes ({jokes.length})</h3>
        <div>
          {jokes.length === 0 ? (
            <p>No jokes available.</p>
          ) : (
            jokes.map((joke) => (
              <div key={joke._id} className="p-4 mb-4 bg-yellow-100 text-gray-800 rounded-lg shadow-md">
                <p>{joke.content}</p>
                <p className="text-sm text-gray-500">Posted on: {new Date(joke.createdAt).toLocaleDateString()}</p>
                <div className="mt-2 flex justify-between items-center">
                  {/* Likes */}
                  <div className="flex items-center space-x-2">
                    <img src="/heart.png" alt="Like" className="w-6 h-6" />
                    <span className="text-sm">{joke.likes?.length || 0} Likes</span>
                  </div>
                  {/* Edit/Delete Buttons */}
                  <div className="flex space-x-4">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => handleEditJoke(joke)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDeleteJoke(joke._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Joke Modal */}
      {editJokeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Edit Joke</h3>
            {jokeError && <p className="text-sm text-red-500 mb-4">{jokeError}</p>}
            <textarea
              className="w-full px-3 py-2 border rounded-lg mb-4 text-black"
              rows="4"
              value={editedJokeContent}
              onChange={(e) => setEditedJokeContent(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => setEditJokeModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleUpdateJoke}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editProfileModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Edit Profile</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">UserName</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-black"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                className="w-full text-blue-2 px-3 py-2 border rounded-lg text-black"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => setEditProfileModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                onClick={handleUpdateProfile}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold text-red-600 mb-4">Are you sure you want to delete your account?</h3>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

