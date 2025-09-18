// import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
// import { useNavigate } from "react-router-dom";

const supabase = createClient(
  "https://wdjivdgdnhbiagbvhtjb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkaml2ZGdkbmhiaWFnYnZodGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjcwODUsImV4cCI6MjA3MzUwMzA4NX0.6z7PGJlrf2CbEjy3SOF2IkPxe6fTQA0ONQ_AvDt7BOA",
  {
    auth: {
      storage: null,
      persistSession: true,
    },
  }
);

const Facebook = () => {
  const handleFacebookLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
    });

    if (error) {
      console.error("Login error:", error.message);
    } else {
      console.log("Redirect to:", data.url); // سيتم تحويل المستخدم
      window.location.href = data.url;
    }
  };

  return (
    <button
      onClick={handleFacebookLogin}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
    >
      Login with Facebook
    </button>
  );
};

export default Facebook;
