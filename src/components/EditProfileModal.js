import { toast } from "react-toastify";

export default function EditProfileModal({
  editedName,
  setEditedName,
  editedEmail,
  setEditedEmail,
  setEditProfileModal,
  handleUpdateProfile,
}) {
  return (
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
            className="w-full px-3 py-2 border rounded-lg text-black"
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
  );
}