import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Google = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
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

        localStorage.setItem("user", JSON.stringify(profile));
        console.log(profile);

        fetch("http://localhost:8081/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Response from server:", data);
          })
          .catch((err) => console.error(err));

        setError("");

        navigate("/profile");
        window.location.reload();
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch user profile.");
      }
    },
    onError: () => {
      console.log("Login failed");
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

      {error && (
        <p className="text-xs font-medium text-red-300">{error}</p>
      )}
    </div>
  );
};

export default Google;

// https://console.cloud.google.com/auth/clients?project=jovial-atlas-472114-p8&supportedpurview=project

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkaml2ZGdkbmhiaWFnYnZodGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjcwODUsImV4cCI6MjA3MzUwMzA4NX0.6z7PGJlrf2CbEjy3SOF2IkPxe6fTQA0ONQ_AvDt7BOA

// wdjivdgdnhbiagbvhtjb
// sb_secret_-zGhja6EmlcPmZrDWPwAXQ_Ewh7He9e
