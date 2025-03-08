export default function MyJokes({ jokes, handleEditJoke, handleDeleteJoke }) {
    return (
      <>
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
                  <div className="flex items-center space-x-2">
                    <img src="/heart.png" alt="Like" className="w-6 h-6" />
                    <span className="text-sm">{joke.likes?.length || 0} Likes</span>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => handleEditJoke(joke)} // Use handleEditJoke here
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