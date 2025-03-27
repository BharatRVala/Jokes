import { toast } from "react-toastify";

export default function EditProfileModal({
  editedName,
  setEditedName,
  editedEmail,
  setEditedEmail,
  setEditProfileModal,
  handleUpdateProfile,
}) {
  // Function to validate email format
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
          {!isValidEmail(editedEmail) && (
            <p className="text-red-500 text-sm mt-1">Invalid email format</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={() => setEditProfileModal(false)}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-white rounded ${
              isValidEmail(editedEmail) ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={() => {
              if (isValidEmail(editedEmail)) {
                handleUpdateProfile();
              } else {
                toast.error("Please enter a valid email address.");
              }
            }}
            disabled={!isValidEmail(editedEmail)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
