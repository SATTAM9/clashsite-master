import { useState } from "react";
import { RiLogoutCircleRFill } from "react-icons/ri";
import ChangeEmail from "./LoginMethod/ChangeEmail";
import Changepass from "./LoginMethod/Changepass";
import Login from "./LoginMethod/Login";
import PlayerProfile from "./LoginMethod/PlayerProfile";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const displayName = user?.name || user?.email?.split("@")[0] || "Chief";
  const email = user?.email || "Email not available";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
      <div className="absolute inset-0">
        <img
          src="/logo.png"
          alt="Clash battleground backdrop"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#05070f]/95 via-[#05070f]/85 to-amber-500/35"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-10">
        <div className="w-full max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr,1.2fr]">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
                    ReqClans Profile
                  </p>
                  <h1 className="text-4xl font-semibold leading-snug text-white">
                    Welcome back, {displayName}
                  </h1>
                  <p className="text-sm text-white/70">
                    Manage your clan credentials, update contact details, and keep your Clash data synced between devices.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-xl font-semibold text-amber-300">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-white">{displayName}</p>
                      <p className="text-sm text-white/70">{email}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 text-sm text-white/80">
                    <div className="rounded-xl border border-white/5 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">Status</p>
                      <p className="mt-2 font-semibold text-emerald-300">Synced & secured</p>
                      <p className="text-white/60">Two fast sign-in methods available and password protection enabled.</p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">Next steps</p>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-amber-300"></span>
                          <span>Set or update your Clash player tag inside the overview tab.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-amber-300"></span>
                          <span>Adjust your email and password from the account settings panel.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-red-400/60 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-300/40"
                >
                  <RiLogoutCircleRFill className="text-lg transition group-hover:text-red-300" />
                  <span>Log out</span>
                </button>
              </div>
            </section>

            <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                    Control Center
                  </p>
                  <h2 className="text-3xl font-semibold text-white">
                    Manage your ReqClans profile
                  </h2>
                  <p className="text-sm text-white/70">
                    Switch between your overview and security settings without losing context.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className={`rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                      activeTab === "profile"
                        ? "bg-amber-500 text-black shadow-lg"
                        : "border border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    Profile overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("settings")}
                    className={`rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                      activeTab === "settings"
                        ? "bg-amber-500 text-black shadow-lg"
                        : "border border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    Account settings
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/90">
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      <PlayerProfile />
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-white">Account security</h3>
                        <p className="text-sm text-white/60">
                          Update your primary email and create a strong password to secure your progress.
                        </p>
                      </div>
                      <div className="space-y-6">
                        <ChangeEmail />
                        <Changepass email={user.email} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
