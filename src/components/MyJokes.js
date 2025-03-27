import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function MyJokes({ jokes, handleEditJoke, handleDeleteJoke }) {
  const { user } = useContext(AuthContext);
  const [jokeList, setJokeList] = useState(jokes || []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jokeToDelete, setJokeToDelete] = useState(null);

  useEffect(() => {
    setJokeList(jokes);
  }, [jokes]);

  const confirmDelete = (jokeId) => {
    setJokeToDelete(jokeId);
    setShowDeleteConfirm(true);
  };

  const onDeleteConfirmed = async () => {
    try {
      await handleDeleteJoke(jokeToDelete);
    } finally {
      setShowDeleteConfirm(false);
      setJokeToDelete(null);
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold text-gray-700 mb-4">
        Your Jokes ({jokeList.length})
      </h3>
      <div>
        {jokeList.length === 0 ? (
          <p>No jokes available.</p>
        ) : (
          jokeList.map((joke) => (
            <div
              key={joke._id}
              className="p-4 mb-4 bg-yellow-100 text-gray-800 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start"
            >
              <div className="flex-1">
                <p className="text-lg font-semibold">{joke.content}</p>
                <p className="text-sm text-gray-700 mt-1">
                  {joke.likes?.length || 0} {joke.likes?.length === 1 ? "like" : "likes"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(joke.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex space-x-2 mt-4 sm:mt-0 sm:ml-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleEditJoke(joke)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => confirmDelete(joke._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmModal
          setShowDeleteConfirm={setShowDeleteConfirm}
          handleDeleteAccount={onDeleteConfirmed}
          title="Delete Joke"
          message="Are you sure you want to delete this joke? This action cannot be undone."
        />
      )}
    </>
  );
}