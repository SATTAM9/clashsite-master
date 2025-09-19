import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Google from "./Google";
import Discord from "./Discord";

const sanitizeUser = (payload) => {
  if (!payload) {
    return null;
  }

  const safeUser = {
    email: payload.email || "",
  };

  if (payload.name) {
    safeUser.name = payload.name;
  }
  if (payload.id2) {
    safeUser.id2 = payload.id2;
  }
  if (payload.verifyEmail !== undefined) {
    safeUser.verifyEmail = payload.verifyEmail;
  }
  if (payload._id) {
    safeUser._id = payload._id;
  }

  return safeUser;
};

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);
      const payload = data.user || data.newUser;

      if (payload) {
        const safeUser = sanitizeUser(payload);
        localStorage.setItem("user", JSON.stringify(safeUser));
        setEmail("");
        setPassword("");
        navigate("/profile", { replace: true });
      } else {
        setError(data.m || data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
      <div className="absolute inset-0">
        <img
          src="/logo.png"
          loading="lazy"
          alt="Clash battleground backdrop"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#05070f]/95 via-[#05070f]/85 to-amber-500/40"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
        <div className="w-full max-w-5xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr,0.95fr]">
            <section className="hidden lg:flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
                ReqClans
              </p>
              <h1 className="text-4xl font-semibold leading-snug text-white">
                Your Clash universe, made mobile friendly.
              </h1>
              <p className="text-white/80">
                Jump back into your profile, track donations, and connect with your clan from any device. The refreshed layout adapts seamlessly to phones, tablets, and desktops.
              </p>
              <ul className="mt-4 space-y-4 text-sm text-white/80">
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
                    1
                  </span>
                  <span>Quick social login with Google or Discord.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
                    2
                  </span>
                  <span>Streamlined form built for touch and keyboard use.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
                    3
                  </span>
                  <span>Save progress securely and continue where you left off.</span>
                </li>
              </ul>
            </section>

            <div className="rounded-3xl border border-white/10 bg-black/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="flex flex-col items-center text-center">
                <img
                  src="/fic.jpeg"
          loading="lazy"
                  alt="ReqClans crest"
                  className="mb-6 w-20 animate-bounce"
                />
                <h2 className="text-3xl font-semibold text-white">
                  Welcome back, Chief
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Sign in to manage your clan, track progress, and sync across every device.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="flex w-full flex-col gap-2">
                  <Google />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Discord />
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/40">
                <span className="h-px flex-1 bg-white/15"></span>
                <span>or continue with email</span>
                <span className="h-px flex-1 bg-white/15"></span>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white/70">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-sm text-black shadow-inner placeholder-black/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white/70">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-sm text-black shadow-inner placeholder-black/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    required
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <a href="/forgetpassword" className="text-sm font-semibold text-amber-300 hover:text-amber-200">
                    Forgot your password?
                  </a>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    {loading ? "Loading..." : "Login"}
                  </button>
                </div>
              </form>

              {error && (
                <p className="mt-4 rounded-2xl bg-red-500/15 p-3 text-sm font-medium text-red-200">
                  {error}
                </p>
              )}

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/80">
                <p>New to ReqClans?</p>
                <a
                  href="/signup"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  Create your account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
