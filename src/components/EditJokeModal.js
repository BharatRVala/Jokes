"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function EditJokeModal({ 
  editedJokeContent,
  setEditedJokeContent,
  jokeError,
  setEditJokeModal,
  handleUpdateJoke,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await handleUpdateJoke();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl font-bold text-blue-600 mb-4">Edit Joke</h3>
        {jokeError && <p className="text-sm text-red-500 mb-4">{jokeError}</p>}
        <textarea
          className="w-full px-3 py-2 border rounded-lg mb-4 text-black"
          rows="4"
          value={editedJokeContent}
          onChange={(e) => setEditedJokeContent(e.target.value)}
          disabled={isLoading}
        />
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={() => setEditJokeModal(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center min-w-[100px]"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}