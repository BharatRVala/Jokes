import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function MyJokes({ jokes, handleEditJoke, handleDeleteJoke }) {
  const { user } = useContext(AuthContext);
  const [jokeList, setJokeList] = useState(jokes || []);

  // Sync jokeList with jokes prop when it updates
  useEffect(() => {
    setJokeList(jokes);
  }, [jokes]);

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
              {/* Left Section: Joke Content */}
              <div className="flex-1">
                <p className="text-lg font-semibold">{joke.content}</p>
                <p className="text-sm text-gray-700 mt-1">
                  {joke.likes?.length || 0} {joke.likes?.length === 1 ? "like" : "likes"}
                </p>
                {/* Date at the bottom */}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(joke.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Right Section: Buttons in one row */}
              <div className="flex space-x-2 mt-4 sm:mt-0 sm:ml-4">
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
          ))
        )}
      </div>
    </>
  );
}
