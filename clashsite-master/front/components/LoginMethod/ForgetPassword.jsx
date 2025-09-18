import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/forgetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Reset link has been sent to your email ✅");
         setTimeout(() => navigate("/login"), 1000);
      } else {
        setMessage(data.m || "Something went wrong");
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
          Forgot Your Password?
        </h1>

        <p className="text-gray-300 mb-6">
          Enter your email below and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-lg shadow-md transition-all ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400 text-black"
            }`}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
      </div>
    </div>
  );
};

export default ForgetPassword;
