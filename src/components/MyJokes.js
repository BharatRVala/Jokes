import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import LikeButton from "./LikeButton";

export default function MyJokes({ jokes, handleEditJoke, handleDeleteJoke }) {
  const { user } = useContext(AuthContext); 
  const [jokeList, setJokeList] = useState(jokes || []);

  // Sync jokeList with jokes prop when it updates
  useEffect(() => {
    setJokeList(jokes);
  }, [jokes]);

  const handleLikeChange = (jokeId, updatedLikes) => {
    setJokeList((prevJokes) =>
      prevJokes.map((joke) =>
        joke._id === jokeId ? { ...joke, likes: updatedLikes } : joke
      )
    );
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
              className="p-4 mb-4 bg-yellow-100 text-gray-800 rounded-lg shadow-md"
            >
              <p>{joke.content}</p>
              <p className="text-sm text-gray-500">
                Posted on: {new Date(joke.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-2 flex justify-between items-center">
                {/* Like Button Integration */}
                <LikeButton
                  jokeId={joke._id}
                  initialLikes={joke.likes || []}
                  userId={user?.userId}
                  onLikeChange={handleLikeChange}
                />

                {/* Edit & Delete Buttons */}
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
    </>
  );
}
