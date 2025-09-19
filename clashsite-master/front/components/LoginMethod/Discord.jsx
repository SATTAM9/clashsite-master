import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

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

const Discord = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [, setUser] = useState(() => {
    const storge = localStorage.getItem("user");
    return storge && storge !== "undefined" ? JSON.parse(storge) : null;
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session ?? null;
        if (session?.user && mounted) {
          const u = { email: session.user.email };
          setUser(u);
          localStorage.setItem("user", JSON.stringify(u));

          try {
            await fetch("http://localhost:8081/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id2: session.user.id, email: session.user.email }),
            });
          } catch (err) {
            console.error("backend login error", err);
          }
        }
      } catch (err) {
        console.error("getSession error", err);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user
        ? { id: session.user.id, email: session.user.email }
        : null;
      setUser(newUser);

      if (_event === "SIGNED_IN") {
        navigate("/profile");
      } else if (_event === "SIGNED_OUT") {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleDiscordLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: window.location.origin + "/profile" },
    });
    if (error) {
      console.error("Login error:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleDiscordLogin}
        className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-indigo-400/40 bg-indigo-500/80 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300/40"
      >
        <img
          src="/Discord.jpg"
          alt="Discord logo"
          className="h-6 w-6 rounded-full"
        />
        <span>Continue with Discord</span>
      </button>
      {error && <p className="text-xs font-medium text-red-300">{error}</p>}
    </div>
  );
};

export default Discord;
