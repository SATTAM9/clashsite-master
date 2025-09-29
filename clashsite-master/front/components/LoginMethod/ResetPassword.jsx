

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// نفس الـ sanitizeUser بتاعك
const sanitizeUser = (payload) => {
  if (!payload) {
    return null;
  }

  const safeUser = {
    email: payload.email || "",
  };

  if (payload.name) safeUser.name = payload.name;
  if (payload.id2) safeUser.id2 = payload.id2;
  if (payload.verifyEmail !== undefined) safeUser.verifyEmail = payload.verifyEmail;
  if (payload._id) safeUser._id = payload._id;

  return safeUser;
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const passwordComplexityRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~=\-/\\]).{6,}$/;

  // معايير كلمة السر
  const getPasswordValidation = (password) => {
    return {
      length: password.length >= 6,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*()_+{}\[\]:;<>,.?~\-=/\\]/.test(password),
    };
  };

  const passwordCriteria = getPasswordValidation(newPassword);
  const showPasswordValidation =
    newPassword.length > 0 && !passwordComplexityRegex.test(newPassword);

  useEffect(() => {
    setPasswordsMatch(
      newPassword !== "" && newPassword === confirmPassword
    );
  }, [newPassword, confirmPassword]);

  const isFormValid = () => {
    return (
      newPassword.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      passwordsMatch &&
      passwordComplexityRegex.test(newPassword)
    );
  };

  const handleReset = async () => {
    if (!isFormValid()) {
      setMessage("Passwords must match and meet all requirements");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/addnewpassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password: newPassword }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("Password changed successfully");
        const safeUser = sanitizeUser(data.user);
        if (safeUser) {
          localStorage.setItem("user", JSON.stringify(safeUser));
        }
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setMessage(data.m || data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="bg-gray-800/90 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">
          Reset Your Password
        </h1>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
        />

        {showPasswordValidation && (
          <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4 text-left">
            <p className="text-xs font-medium text-white/70 mb-3">
              Password requirements:
            </p>
            <ul className="space-y-2">
              <li className={`flex items-center gap-2 text-xs ${passwordCriteria.length ? "text-emerald-300" : "text-red-300"}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${passwordCriteria.length ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                  {passwordCriteria.length ? "✓" : "✗"}
                </span>
                At least 6 characters long
              </li>
              <li className={`flex items-center gap-2 text-xs ${passwordCriteria.lowercase ? "text-emerald-300" : "text-red-300"}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${passwordCriteria.lowercase ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                  {passwordCriteria.lowercase ? "✓" : "✗"}
                </span>
                Contains lowercase letter (a-z)
              </li>
              <li className={`flex items-center gap-2 text-xs ${passwordCriteria.uppercase ? "text-emerald-300" : "text-red-300"}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${passwordCriteria.uppercase ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                  {passwordCriteria.uppercase ? "✓" : "✗"}
                </span>
                Contains uppercase letter (A-Z)
              </li>
              <li className={`flex items-center gap-2 text-xs ${passwordCriteria.number ? "text-emerald-300" : "text-red-300"}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${passwordCriteria.number ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                  {passwordCriteria.number ? "✓" : "✗"}
                </span>
                Contains number (0-9)
              </li>
              <li className={`flex items-center gap-2 text-xs ${passwordCriteria.symbol ? "text-emerald-300" : "text-red-300"}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${passwordCriteria.symbol ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                  {passwordCriteria.symbol ? "✓" : "✗"}
                </span>
                Contains special character (!@#$%^&*...)
              </li>
            </ul>
          </div>
        )}

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full mb-4 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-4 focus:ring-yellow-400 ${
            confirmPassword
              ? passwordsMatch
                ? "border border-emerald-400"
                : "border border-red-400"
              : ""
          }`}
        />

        {confirmPassword && (
          <span
            className={`block text-xs font-medium mb-2 ${
              passwordsMatch ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
          </span>
        )}

        <button
          onClick={handleReset}
          disabled={!isFormValid() || loading}
          className={`w-full text-black font-bold py-3 rounded-lg shadow-md transition-all ${
            isFormValid()
              ? "bg-yellow-500 hover:bg-yellow-400"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Saving..." : "Save New Password"}
        </button>

        {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
