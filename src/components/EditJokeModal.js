export default function EditJokeModal({ 
  editedJokeContent,
  setEditedJokeContent,
  jokeError,
  setEditJokeModal,
  handleUpdateJoke,
}) {
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
        />
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
  );
}
