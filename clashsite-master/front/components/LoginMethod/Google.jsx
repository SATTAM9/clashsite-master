import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";

const Google = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      console.log("Access Token:", accessToken);
      if (!accessToken) {
        setError("No access token returned.");
        return;
      }

      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const profile = await res.json();
        console.log(profile);
        console.log(profile.email);

        // ابعته للسيرفر
        const signupRes = await fetch(
          `${import.meta.env.VITE_API_URL}/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // credentials: "include", // لو عايز الكوكي
            body: JSON.stringify({ email: profile.email, provider: "google" }),
          }
        );

        const data = await signupRes.json();

        if (signupRes.ok && data.accessToken) {
          Cookies.set("accessToken", data.accessToken);
          navigate("/profile", { replace: true });
        } else {
          setError(data.message || "Signup failed");
          console.error("Signup error:", data);
        }
      } catch (err) {
        console.error(err);
        setError("Error connecting to server");
      }
    },
    onError: () => {
      setError("Google Login Failed. Try again.");
    },
  });

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => login()}
        className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-300/40"
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google logo"
          className="h-5 w-5"
        />
        <span>Continue with Google</span>
      </button>

      {error && <p className="text-xs font-medium text-red-300">{error}</p>}
    </div>
  );
};

export default Google;
