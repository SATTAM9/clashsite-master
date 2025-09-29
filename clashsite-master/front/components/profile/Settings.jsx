
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
} from "../app/slices/authSlice";
import Cookies from "js-cookie";

const Settings = () => {
  const token = Cookies.get("accessToken");
  let decoded = null;

  try {
    decoded = jwtDecode(token);
  } catch (err) {
    console.error("Invalid token", err);
  }

  const currentEmail = decoded?.userInfo?.email || "";
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [updateEmail, { isLoading: isEmailLoading }] = useUpdateEmailMutation();
  const [updatePassword, { isLoading: isPassLoading }] = useUpdatePasswordMutation();

  // state للرسائل
  const [message, setMessage] = useState(null);

  // مسح الرسالة بعد 3 ثواني
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!decoded) return <Navigate to="/login" replace />;

  const handleEmailUpdate = async () => {
    try {
      await updateEmail({ localEmail: currentEmail, newEmail }).unwrap();
      setMessage({ text: "Email updated successfully", type: "success" });
    } catch (err) {
      setMessage({ text: err?.data?.message || "Failed to update email", type: "error" });
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await updatePassword({
        email: currentEmail,
        currentPassword,
        newPassword,
      }).unwrap();
      setMessage({ text: "Password updated successfully", type: "success" });
    } catch (err) {
      setMessage({ text: err?.data?.message || "Failed to update password", type: "error" });
    }
  };

  return (
    <div className="space-y-4 text-white">
      <h3 className="text-lg font-bold">Settings</h3>

      {message && (
        <div
          className={`p-2 rounded ${
            message.type === "error"
              ? "bg-red-500/30 text-red-300"
              : "bg-green-500/30 text-green-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm">Current Email:</label>
        <input
          value={currentEmail}
          disabled
          className="border border-white/20 bg-black/30 p-2 rounded w-full text-white"
        />
      </div>

      <div>
        <label className="block text-sm">New Email:</label>
        <input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="new@email.com"
          className="border border-white/20 bg-black/30 p-2 rounded w-full text-white"
        />
        <button
          onClick={handleEmailUpdate}
          disabled={isEmailLoading}
          className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 px-4 py-2 rounded-xl mt-2"
        >
          {isEmailLoading ? "Updating..." : "Update Email"}
        </button>
      </div>

      <div>
        <label className="block text-sm">Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border border-white/20 bg-black/30 p-2 rounded w-full text-white"
        />
      </div>
      <div>
        <label className="block text-sm">New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border border-white/20 bg-black/30 p-2 rounded w-full text-white"
        />
        <button
          onClick={handlePasswordUpdate}
          disabled={isPassLoading}
          className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 px-4 py-2 rounded-xl mt-2"
        >
          {isPassLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
