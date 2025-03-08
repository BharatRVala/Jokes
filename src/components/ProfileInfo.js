export default function ProfileInfo({ user, setEditProfileModal, setShowDeleteConfirm }) {
    return (
      <div className="mb-6">
        <p className="text-lg text-blue-600">
          <strong>UserName:</strong> {user?.userName || 'N/A'}
        </p>
        <p className="text-lg text-green-600">
          <strong>Email:</strong> {user?.email || 'N/A'}
        </p>
        <div className="flex space-x-4 mb-8">
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            onClick={() => setEditProfileModal(true)}
          >
            Edit Profile
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </button>
        </div>
      </div>
    );
  }