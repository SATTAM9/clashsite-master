import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "chart.js/auto";
import Settings from "./Settings";
import OverView from "./OverView";
import { jwtDecode } from "jwt-decode";
import LinkedClans from "./LinkedClans";

const Profile = () => {
  // const token = Cookies.get("accessToken");
  const [activeTab, setActiveTab] = useState("profile");
  const [userName, setUserName] = useState("");
  console.log(userName);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded?.userInfo?.email || decoded?.userInfo?.name);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    window.location.href = "/login";
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-10 bg-gradient-to-br from-black to-gray-900">
      <div className="w-full max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr,1.2fr]">
          {/* Left side profile card */}
          <section className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
                  clashvip Profile
                </p>
                <h1 className="text-4xl font-semibold leading-snug text-white">
                  Welcome back, {userName}
                </h1>
                <p className="text-sm text-white/70">
                  Manage your clan credentials, extend security, and coordinate
                  services without leaving your hub.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-xl font-semibold text-amber-300">
                    U
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-white">User</p>
                    <p className="text-sm text-white/70">{userName}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 text-sm text-white/80">
                  <div className="rounded-xl border border-white/5 bg-black/40 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                      Status
                    </p>
                    <p className="mt-2 font-semibold text-emerald-300">
                      {"Two-factor protected Synced & secured"}
                    </p>
                    <p className="text-white/60">
                      {
                        "Enable two-factor authentication to lock down new logins."
                      }
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="mt-2 rounded-xl bg-red-500/20 px-4 py-2 text-red-300 hover:bg-red-500/40"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Right side: Only Profile & Settings */}
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: "profile", label: "Linked players" },
                { id: "clans", label: "Linked clans" },
                { id: "settings", label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-sm ${
                    activeTab === tab.id
                      ? "bg-amber-500/30 text-amber-200"
                      : "bg-black/30 text-white/60 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Profile overview */}
            {activeTab === "profile" && <OverView />}

            {/* Settings tab */}
            {activeTab === "settings" && <Settings />}
            {activeTab === "clans" && <LinkedClans />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
