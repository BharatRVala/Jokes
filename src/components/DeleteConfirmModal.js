export default function DeleteConfirmModal({ setShowDeleteConfirm, handleDeleteAccount }) {
  return (
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
  );
}