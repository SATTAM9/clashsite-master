import React, { useState } from "react";
import axios from "axios";

const Changepass = ({ email }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match");
      return;
    }

    try {
      const res = await axios.post(
         `${import.meta.env.VITE_API_URL}/updatePassword`,
        {
          email,
          currentPassword,
          newPassword,
        }
      );
      setMessage(res.data.message);
      setTimeout(() => {
        setMessage("");
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating password");
      setTimeout(() => {
        setMessage("");
      }, 500);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-4 bg-gray-800 rounded-lg text-white"
    >
      <h2 className="text-xl mb-4">Change Password</h2>

      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full mb-3 p-3 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full mb-3 p-3 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full mb-3 p-3 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        className="mt-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
      >
        Save Changes
      </button>

      {message && (
        <p className="mt-3 text-center text-sm text-green-400">{message}</p>
      )}
    </form>
  );
};

export default Changepass;
