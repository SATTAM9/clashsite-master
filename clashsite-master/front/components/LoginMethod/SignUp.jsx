import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Google from "./Google";

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

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    setPasswordsMatch(password !== "" && password === confirmPassword);
  }, [password, confirmPassword]);

  const isFormValid = () => {
    return (
      email.trim() !== "" &&
      password.trim() !== "" &&
      passwordsMatch &&
      password.length >= 6
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      const payload = data.user || data.newUser;

      if (res.ok && payload) {
        const safeUser = sanitizeUser(payload);
        localStorage.setItem("user", JSON.stringify(safeUser));
        setInfo("Signed up successfully");
        navigate("/profile", { replace: true });
      } else {
        setError(data.m || data.message || "Signup failed");
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#05070f]/95 via-[#05070f]/85 to-amber-500/35"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
        <div className="w-full max-w-5xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr,0.95fr]">
            <section className="hidden lg:flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
                ReqClans
              </p>
              <h1 className="text-4xl font-semibold leading-snug text-white">
                Level up your Clash journey.
              </h1>
              <p className="text-white/80">
                Create a free ReqClans account to monitor clan performance, share strategies, and keep your profile in sync across every device.
              </p>
              <ul className="mt-4 space-y-4 text-sm text-white/80">
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
                    1
                  </span>
                  <span>Choose a social login or sign up with your email.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
                    2
                  </span>
                  <span>Secure your account with a strong password.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
                    3
                  </span>
                  <span>Jump into custom dashboards made for chiefs like you.</span>
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
                  Create your ReqClans account
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Start tracking clan donations, progress, and player stats with a single login.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="flex w-full flex-col gap-2">
                  <Google />
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/40">
                <span className="h-px flex-1 bg-white/15"></span>
                <span>or sign up with email</span>
                <span className="h-px flex-1 bg-white/15"></span>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
                autoComplete="off"
              >
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium text-white/70">
                    Email address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-sm text-black shadow-inner placeholder-black/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium text-white/70">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a secure password"
                    className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-sm text-black shadow-inner placeholder-black/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    required
                  />
                  <p className="text-xs text-white/60">Minimum 6 characters. Mix letters, numbers, and symbols for extra security.</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-confirm" className="text-sm font-medium text-white/70">
                    Confirm password
                  </label>
                  <input
                    id="signup-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 ${
                      confirmPassword
                        ? passwordsMatch
                          ? "border-emerald-400 bg-white/95 text-black focus:border-emerald-400 focus:ring-emerald-300/50"
                          : "border-red-400 bg-white/95 text-black focus:border-red-400 focus:ring-red-300/40"
                        : "border-white/15 bg-white/95 text-black focus:border-amber-400 focus:ring-amber-400/40"
                    }`}
                    required
                  />
                  {confirmPassword.length > 0 && (
                    <span
                      className={`text-xs font-medium ${
                        passwordsMatch ? "text-emerald-300" : "text-red-300"
                      }`}
                    >
                      {passwordsMatch
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid() || loading}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Loading..." : "Sign Up"}
                </button>
              </form>

              {error && (
                <p className="mt-5 rounded-2xl bg-red-500/15 p-3 text-sm font-medium text-red-200">
                  {error}
                </p>
              )}

              {info && (
                <p className="mt-5 rounded-2xl bg-emerald-500/15 p-3 text-sm font-medium text-emerald-200">
                  {info}
                </p>
              )}

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/80">
                <p>Already have an account?</p>
                <a
                  href="/login"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  Back to login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
