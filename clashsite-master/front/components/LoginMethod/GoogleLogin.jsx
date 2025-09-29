

import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie"; // لازم نضيفه

const GoogleLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google login success:", tokenResponse);
      setError("");
      setIsLoading(true);

      const accessToken = tokenResponse.access_token;
      if (!accessToken) {
        console.error("No access token returned.");
        setError("No access token returned.");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching Google user profile...");
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!res.ok) {
          throw new Error(`Google API returned status ${res.status}`);
        }

        const profile = await res.json();
        console.log("Profile fetched:", profile);
        console.log("Profile fetched:", profile.email);

        try {
          console.log("Sending user to backend...");
          const backendRes = await fetch(
            `${import.meta.env.VITE_API_URL}/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: profile.email,
                provider: "google",
              }),
            }
          );

          const data = await backendRes.json();
          console.log("Backend response:", data);

          if (!backendRes.ok || data.error) {
            console.error("Backend returned error:", data);
            setError(data.message || "Backend login failed.");
          } else {
            // 👇👇 هنا تخزين التوكن في الكوكي
            if (data.accessToken) {
              Cookies.set("accessToken", data.accessToken, { path: "/" });
            }

            navigate("/profile");
          }
        } catch (backendErr) {
          console.error("Error sending data to backend:", backendErr);
          setError("Failed to communicate with backend.");
        }
      } catch (err) {
        console.error("Error fetching Google profile:", err);
        setError("Failed to fetch user profile.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (err) => {
      console.error("Google login failed:", err);
      setError("Google Login Failed. Try again.");
    },
  });

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => {
          console.log("Login button clicked");
          login();
        }}
        disabled={isLoading}
        className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-300/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google logo"
          className="h-5 w-5"
        />
        <span>{isLoading ? "Logging in..." : "Continue with Google"}</span>
      </button>

      {error && <p className="text-xs font-medium text-red-300">{error}</p>}
    </div>
  );
};

export default GoogleLogin;
