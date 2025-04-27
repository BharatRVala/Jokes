'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import ProfileInfo from '@/components/ProfileInfo';
import MyJokes from '@/components/MyJokes';
import { toast } from "react-toastify";
import EditJokeModal from '@/components/EditJokeModal';
import EditProfileModal from '@/components/EditProfileModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import ProfileSkeleton from '@/components/ProfileSkeleton'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

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
      } finally {
        setLoading(false); // Set loading to false after fetching data
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
    const token = Cookies.get("auth_token");
    
    if (!token) {
      toast.error('Please login to update jokes');
      router.push('/login');
      return;
    }
  
    if (!editedJokeContent.trim()) {
      toast.error("Joke content cannot be empty.");
      return;
    }
  
    try {
      const res = await fetch("/api/jokes/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
        setJokes(prev => 
          prev.map(joke => joke._id === updatedJoke._id ? updatedJoke : joke)
        );
        setEditJokeModal(false);
        toast.success("Joke updated successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update the joke.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
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
          jokeId,
          userId: user._id,
        }),
      });

      if (res.ok) {
        setJokes((prev) => prev.filter((joke) => joke._id !== jokeId));
        toast.success('Joke deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        const data = await res.json();
        setDeleteError(data.error || 'Failed to delete the joke.');
        toast.error(data.error || 'Something went wrong. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err) {
      setDeleteError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };



  const handleUpdateProfile = async () => {
    const token = Cookies.get('auth_token');
    
    if (!token) {
      toast.error('Please login to update your profile');
      router.push('/login');
      return;
    }
  
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
  
      const data = await res.json();
  
      if (!res.ok) {
        toast.error(data.message || 'Failed to update profile.');
        return;
      }
  
      // Update state immediately
      setUser(prev => ({
        ...prev,
        userName: data.user.userName,
        email: data.user.email
      }));
      
      setEditProfileModal(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('An error occurred while updating your profile.');
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
        toast.success('Account deleted successfully!');
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete account.');
        toast.error(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while deleting your account.');
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar is always visible */}
      <ToastContainer />
      <Navbar />

      {/* Show skeleton or content based on loading state */}
      {loading ? (
        <ProfileSkeleton />
      ) : (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">User Profile</h2>
          {message && <p className="text-green-500 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Profile Info */}
          <ProfileInfo
            user={user}
            setEditProfileModal={setEditProfileModal}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />

          {/* Jokes Section */}
          <MyJokes 
            jokes={jokes} 
            handleEditJoke={handleEditJoke} 
            handleDeleteJoke={handleDeleteJoke} 
          />
          
        </div>
      )}

      {/* Edit Joke Modal */}
      {editProfileModal && (
  <EditProfileModal
    editedName={editedName}
    setEditedName={setEditedName}
    editedEmail={editedEmail}
    setEditedEmail={setEditedEmail}
    setEditProfileModal={setEditProfileModal}
    handleUpdateProfile={handleUpdateProfile}
  />
)}

{editJokeModal && (
        <EditJokeModal
          editedJokeContent={editedJokeContent}
          setEditedJokeContent={setEditedJokeContent}
          jokeError={jokeError}
          setEditJokeModal={setEditJokeModal}
          handleUpdateJoke={handleUpdateJoke}
        />
      )}
      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          setShowDeleteConfirm={setShowDeleteConfirm}
          handleDeleteAccount={handleDeleteAccount}
        />
      )}
    </div>
  );
}