import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Google from "./Google";
import Cookies from "js-cookie";
import { useSignupMutation } from "../app/slices/authSlice";
import Discord from "./Discord";

const SignUp = () => {
  const navigate = useNavigate();

  const [userInputs, setUserInputs] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [localError, setLocalError] = useState("");

  // regex للتحقق من التعقيد
  const passwordComplexityRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~=\-/\\]).{6,}$/;

  useEffect(() => {
    setPasswordsMatch(
      userInputs.password !== "" &&
        userInputs.password === userInputs.confirmPassword
    );
  }, [userInputs.password, userInputs.confirmPassword]);

  // التحقق من معايير كلمة المرور
  const getPasswordValidation = (password) => {
    const criteria = {
      length: password.length >= 6,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*()_+{}\[\]:;<>,.?~\-=/\\]/.test(password),
    };

    return criteria;
  };

  const isFormValid = () => {
    return (
      userInputs.email.trim() !== "" &&
      passwordsMatch &&
      passwordComplexityRegex.test(userInputs.password)
    );
  };

  const [signup, { isLoading, error: apiError }] = useSignupMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(""); // امسح أي error قديم

    if (!userInputs.email.trim()) {
      setLocalError("Email is required");
      return;
    }

    if (!passwordComplexityRegex.test(userInputs.password)) {
      setLocalError("Password does not meet the complexity requirements");
      return;
    }

    if (!passwordsMatch) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      const result = await signup({
        email: userInputs.email,
        password: userInputs.password,
      });

      if (result.error) {
        // لو الـ API رجعت Error
        setLocalError(
          result.error?.data?.message || "Signup failed. Try again."
        );
        return;
      }

      const token = result.data?.accessToken;
      if (token) {
        Cookies.set("accessToken", token, { path: "/" });

        setUserInputs({
          email: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/profile");
      }
    } catch (err) {
      setLocalError("Unexpected error. Please try again.");
      console.error("Signup error:", err);
    }
  };

  const passwordCriteria = getPasswordValidation(userInputs.password);
  const showPasswordValidation =
    userInputs.password.length > 0 &&
    !passwordComplexityRegex.test(userInputs.password);

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
                clashvip
              </p>
              <h1 className="text-4xl font-semibold leading-snug text-white">
                Level up your Clash journey.
              </h1>
              <p className="text-white/80">
                Create a free clashvip account to monitor clan performance,
                share strategies, and keep your profile in sync across every
                device.
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
                  <span>
                    Jump into custom dashboards made for chiefs like you.
                  </span>
                </li>
              </ul>
            </section>

            <div className="rounded-3xl border border-white/10 bg-black/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="flex flex-col items-center text-center">
                <img
                  src="/fic.jpeg"
                  loading="lazy"
                  alt="clashvip crest"
                  className="mb-6 w-20 animate-bounce"
                />
                <h2 className="text-3xl font-semibold text-white">
                  Create your clashvip account
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Start tracking clan donations, progress, and player stats with
                  a single login.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="flex w-full flex-col gap-2">
                  {/* <Discord /> */}
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
                  <label
                    htmlFor="signup-email"
                    className="text-sm font-medium text-white/70"
                  >
                    Email address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={userInputs.email}
                    onChange={(e) =>
                      setUserInputs((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-sm text-black shadow-inner placeholder-black/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="signup-password"
                    className="text-sm font-medium text-white/70"
                  >
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={userInputs.password}
                    onChange={(e) =>
                      setUserInputs((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Enter a secure password"
                    className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-sm text-black shadow-inner placeholder-black/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    required
                  />

                  {showPasswordValidation && (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-medium text-white/70 mb-3">
                        Password requirements:
                      </p>
                      <ul className="space-y-2">
                        <li
                          className={`flex items-center gap-2 text-xs ${
                            passwordCriteria.length
                              ? "text-emerald-300"
                              : "text-red-300"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                              passwordCriteria.length
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {passwordCriteria.length ? "✓" : "✗"}
                          </span>
                          At least 6 characters long
                        </li>
                        <li
                          className={`flex items-center gap-2 text-xs ${
                            passwordCriteria.lowercase
                              ? "text-emerald-300"
                              : "text-red-300"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                              passwordCriteria.lowercase
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {passwordCriteria.lowercase ? "✓" : "✗"}
                          </span>
                          Contains lowercase letter (a-z)
                        </li>
                        <li
                          className={`flex items-center gap-2 text-xs ${
                            passwordCriteria.uppercase
                              ? "text-emerald-300"
                              : "text-red-300"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                              passwordCriteria.uppercase
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {passwordCriteria.uppercase ? "✓" : "✗"}
                          </span>
                          Contains uppercase letter (A-Z)
                        </li>
                        <li
                          className={`flex items-center gap-2 text-xs ${
                            passwordCriteria.number
                              ? "text-emerald-300"
                              : "text-red-300"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                              passwordCriteria.number
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {passwordCriteria.number ? "✓" : "✗"}
                          </span>
                          Contains number (0-9)
                        </li>
                        <li
                          className={`flex items-center gap-2 text-xs ${
                            passwordCriteria.symbol
                              ? "text-emerald-300"
                              : "text-red-300"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                              passwordCriteria.symbol
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {passwordCriteria.symbol ? "✓" : "✗"}
                          </span>
                          Contains special character (!@#$%^&*...)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="signup-confirm"
                    className="text-sm font-medium text-white/70"
                  >
                    Confirm password
                  </label>
                  <input
                    id="signup-confirm"
                    type="password"
                    value={userInputs.confirmPassword}
                    onChange={(e) =>
                      setUserInputs((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Re-enter your password"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 ${
                      userInputs.confirmPassword
                        ? passwordsMatch
                          ? "border-emerald-400 bg-white/95 text-black focus:border-emerald-400 focus:ring-emerald-300/50"
                          : "border-red-400 bg-white/95 text-black focus:border-red-400 focus:ring-red-300/40"
                        : "border-white/15 bg-white/95 text-black focus:border-amber-400 focus:ring-amber-400/40"
                    }`}
                    required
                  />
                  {userInputs.confirmPassword.length > 0 && (
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

                {localError && (
                  <div className="rounded-2xl bg-red-500/15 border border-red-500/20 p-3 text-sm font-medium text-red-200">
                    {localError}
                  </div>
                )}

                {apiError && !localError && (
                  <div className="rounded-2xl bg-red-500/15 border border-red-500/20 p-3 text-sm font-medium text-red-200">
                    {typeof apiError === "string"
                      ? apiError
                      : apiError.data?.message ||
                        "An error occurred during signup"}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isFormValid() || isLoading}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>
              </form>

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
