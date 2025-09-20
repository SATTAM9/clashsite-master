import { useMemo, useState } from "react";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { FaBell, FaPlug, FaShieldAlt, FaUsersCog } from "react-icons/fa";
import { MdOutlineInsights } from "react-icons/md";
import ChangeEmail from "./LoginMethod/ChangeEmail";
import Changepass from "./LoginMethod/Changepass";
import Login from "./LoginMethod/Login";
import PlayerProfile from "./LoginMethod/PlayerProfile";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupEmail, setBackupEmail] = useState("");
  const [backupEmailDraft, setBackupEmailDraft] = useState("");
  const [activeSessions, setActiveSessions] = useState([
    {
      id: "current",
      name: "This device",
      location: "Riyadh, SA",
      lastActive: "Just now",
      current: true,
    },
    {
      id: "ipad",
      name: "iPad Pro",
      location: "Jeddah, SA",
      lastActive: "6 hours ago",
      current: false,
    },
  ]);
  const [linkedAccounts, setLinkedAccounts] = useState({
    supercell: true,
    google: true,
    discord: false,
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    donations: true,
    warAlerts: true,
    roleChanges: false,
    weeklyDigest: true,
  });
  const [clanServicesState, setClanServicesState] = useState({
    warDate: "",
    warNotes: "",
    inviteLink: "",
    strategyName: "",
  });
  const [uploadedStrategyFile, setUploadedStrategyFile] = useState(null);

  const displayName = user?.name || user?.email?.split("@")[0] || "Chief";
  const email = user?.email || "Email not available";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleSessionEnd = (id) => {
    setActiveSessions((sessions) => sessions.filter((session) => session.id !== id));
  };

  const handleAccountToggle = (provider) => {
    setLinkedAccounts((prev) => ({
      ...prev,
      [provider]: !prev[provider],
    }));
  };

  const toggleNotification = (key) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleClanServicesChange = (field, value) => {
    setClanServicesState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const performanceData = useMemo(
    () => ({
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
      datasets: [
        {
          label: "Donations",
          data: [80, 120, 140, 110, 160, 190],
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.18)",
          tension: 0.35,
          fill: true,
        },
        {
          label: "Raid Medals",
          data: [35, 45, 50, 48, 60, 75],
          borderColor: "#34d399",
          backgroundColor: "rgba(52, 211, 153, 0.18)",
          tension: 0.35,
          fill: true,
        },
      ],
    }),
    []
  );

  const performanceOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: { color: "#f3f4f6" },
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(148, 163, 184, 0.15)" },
        },
        y: {
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(148, 163, 184, 0.1)" },
          beginAtZero: true,
        },
      },
    }),
    []
  );

  if (!user) {
    return <Login />;
  }

  const tabs = [
    { id: "profile", label: "Profile overview" },
    { id: "security", label: "Security center" },
    { id: "integrations", label: "Linked accounts" },
    { id: "notifications", label: "Notifications" },
    { id: "clan", label: "Clan services" },
  ];

  const linkedProviders = [
    {
      id: "supercell",
      label: "Supercell ID",
      description: "Sync profile progress across devices and keep purchases protected.",
    },
    {
      id: "google",
      label: "Google",
      description: "Enable single sign-on and share Google contacts with clan managers.",
    },
    {
      id: "discord",
      label: "Discord",
      description: "Receive instant war pings in your clan Discord server.",
    },
  ];

  const notificationItems = [
    {
      id: "donations",
      title: "Donation milestones",
      description: "Get notified when you or your clan cross a donation target.",
    },
    {
      id: "warAlerts",
      title: "War & raid alerts",
      description: "Receive reminders before war attacks and raid weekends.",
    },
    {
      id: "roleChanges",
      title: "Role changes",
      description: "Stay updated when elders or co-leaders rotate responsibilities.",
    },
    {
      id: "weeklyDigest",
      title: "Weekly digest",
      description: "Summary email covering war results, top donors, and trophies.",
    },
  ];

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
                    Manage your clan credentials, extend security, and coordinate services without leaving your hub.
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
                      <p className="mt-2 font-semibold text-emerald-300">
                        {twoFactorEnabled ? "Two-factor protected" : "Synced & secured"}
                      </p>
                      <p className="text-white/60">
                        {twoFactorEnabled
                          ? "Authenticator codes required for every new device."
                          : "Enable two-factor authentication to lock down new logins."}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">Next steps</p>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-amber-300"></span>
                          <span>Document your clan strategy in the services tab for co-leaders.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-amber-300"></span>
                          <span>Link Discord to automate war reminders for your members.</span>
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
                    Switch between overview, security, linked accounts, notifications, and clan services.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                        activeTab === tab.id
                          ? "bg-amber-500 text-black shadow-lg"
                          : "border border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/90">
                  {activeTab === "profile" && (
                    <div className="space-y-8">
                      <PlayerProfile />

                      <section className="rounded-2xl border border-white/10 bg-black/40 p-6">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-white/50">
                              <MdOutlineInsights className="text-base text-amber-300" />
                              Performance
                            </p>
                            <h3 className="mt-1 text-2xl font-semibold text-white">Recent activity snapshot</h3>
                          </div>
                        </div>
                        <div className="mt-6 h-64">
                          <Line data={performanceData} options={performanceOptions} />
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Donation streak</p>
                            <p className="mt-2 text-2xl font-semibold text-amber-300">6 weeks</p>
                            <p className="text-xs text-white/60">Keep it going to unlock seasonal rewards.</p>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Best raid medal week</p>
                            <p className="mt-2 text-2xl font-semibold text-emerald-300">75</p>
                            <p className="text-xs text-white/60">High activity logged during week 6 raids.</p>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Next target</p>
                            <p className="mt-2 text-2xl font-semibold text-white">200 donations</p>
                            <p className="text-xs text-white/60">Configure alerts from the notifications tab.</p>
                          </div>
                        </div>
                      </section>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-8">
                      <section className="rounded-2xl border border-white/10 bg-black/40 p-6">
                        <div className="flex items-center gap-3 text-white">
                          <FaShieldAlt className="text-xl text-amber-300" />
                          <div>
                            <h3 className="text-xl font-semibold">Security center</h3>
                            <p className="text-sm text-white/60">Strengthen login safety and review active sessions.</p>
                          </div>
                        </div>

                        <div className="mt-6 space-y-6">
                          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-5">
                            <div>
                              <p className="text-base font-semibold text-white">Two-factor authentication</p>
                              <p className="text-sm text-white/60">
                                Use a one-time code from an authenticator when signing in on new devices.
                              </p>
                            </div>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={twoFactorEnabled}
                              onClick={() => setTwoFactorEnabled((prev) => !prev)}
                              className={`flex h-10 w-20 items-center rounded-full border border-white/20 bg-black/60 px-1 transition ${
                                twoFactorEnabled ? "border-emerald-300 bg-emerald-400/20" : ""
                              }`}
                            >
                              <span
                                className={`h-8 w-8 rounded-full bg-white transition ${
                                  twoFactorEnabled ? "translate-x-10 bg-emerald-300" : "translate-x-0 bg-white"
                                }`}
                              ></span>
                            </button>
                          </div>

                          <form
                            className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5"
                            onSubmit={(event) => {
                              event.preventDefault();
                              if (backupEmailDraft.trim()) {
                                setBackupEmail(backupEmailDraft.trim());
                                setBackupEmailDraft("");
                              }
                            }}
                          >
                            <div className="flex items-center gap-3 text-white">
                              <FaShieldAlt className="text-lg text-amber-300" />
                              <div>
                                <p className="text-base font-semibold">Backup recovery email</p>
                                <p className="text-sm text-white/60">
                                  Add an alternate email to receive recovery links if you get locked out.
                                </p>
                              </div>
                            </div>
                            <input
                              type="email"
                              required
                              value={backupEmailDraft}
                              placeholder="you@backupmail.com"
                              onChange={(event) => setBackupEmailDraft(event.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-amber-300 focus:outline-none"
                            />
                            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/70">
                              <p>Current backup: {backupEmail || "Not configured"}</p>
                              <button
                                type="submit"
                                className="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-black transition hover:bg-amber-400"
                              >
                                Save email
                              </button>
                            </div>
                          </form>

                          <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
                            <h4 className="text-base font-semibold text-white">Active sessions</h4>
                            <p className="text-sm text-white/60">Revoke any device you do not recognize.</p>
                            <div className="space-y-3">
                              {activeSessions.map((session) => (
                                <div
                                  key={session.id}
                                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/40 px-4 py-3"
                                >
                                  <div>
                                    <p className="font-semibold text-white">
                                      {session.name}
                                      {session.current && <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-200">Current</span>}
                                    </p>
                                    <p className="text-xs text-white/60">{session.location} - Last active {session.lastActive}</p>
                                  </div>
                                  {!session.current && (
                                    <button
                                      type="button"
                                      onClick={() => handleSessionEnd(session.id)}
                                      className="rounded-xl border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-200 transition hover:border-red-300 hover:bg-red-500/20"
                                    >
                                      Sign out
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white">Account credentials</h3>
                        <p className="text-sm text-white/60">
                          Update your primary email and create a strong password to secure your progress.
                        </p>
                        <div className="space-y-6">
                          <ChangeEmail />
                          <Changepass email={user.email} />
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "integrations" && (
                    <section className="space-y-6">
                      <header className="flex items-center gap-3 text-white">
                        <FaPlug className="text-xl text-amber-300" />
                        <div>
                          <h3 className="text-xl font-semibold">Linked accounts</h3>
                          <p className="text-sm text-white/60">
                            Connect trusted services to streamline sign-ins and automate notifications.
                          </p>
                        </div>
                      </header>

                      <div className="space-y-4">
                        {linkedProviders.map((provider) => {
                          const isLinked = linkedAccounts[provider.id];

                          return (
                            <div
                              key={provider.id}
                              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-5"
                            >
                              <div>
                                <p className="text-base font-semibold text-white">{provider.label}</p>
                                <p className="text-sm text-white/60">{provider.description}</p>
                                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40">
                                  Status: {isLinked ? "Connected" : "Not linked"}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAccountToggle(provider.id)}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                                  isLinked
                                    ? "border border-red-400/40 text-red-200 hover:border-red-300 hover:bg-red-500/20"
                                    : "border border-emerald-400/40 text-emerald-200 hover:border-emerald-300 hover:bg-emerald-500/20"
                                }`}
                              >
                                {isLinked ? "Disconnect" : "Connect"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {activeTab === "notifications" && (
                    <section className="space-y-6">
                      <header className="flex items-center gap-3 text-white">
                        <FaBell className="text-xl text-amber-300" />
                        <div>
                          <h3 className="text-xl font-semibold">Notification preferences</h3>
                          <p className="text-sm text-white/60">
                            Pick how you stay informed about your ReqClans activity.
                          </p>
                        </div>
                      </header>

                      <div className="space-y-4">
                        {notificationItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-5"
                          >
                            <div>
                              <p className="text-base font-semibold text-white">{item.title}</p>
                              <p className="text-sm text-white/60">{item.description}</p>
                            </div>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={notificationPrefs[item.id]}
                              onClick={() => toggleNotification(item.id)}
                              className={`flex h-10 w-20 items-center rounded-full border border-white/20 bg-black/60 px-1 transition ${
                                notificationPrefs[item.id]
                                  ? "border-amber-300 bg-amber-400/10"
                                  : ""
                              }`}
                            >
                              <span
                                className={`h-8 w-8 rounded-full bg-white transition ${
                                  notificationPrefs[item.id]
                                    ? "translate-x-10 bg-amber-300"
                                    : "translate-x-0 bg-white"
                                }`}
                              ></span>
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h4 className="text-base font-semibold text-white">Delivery channels</h4>
                        <p className="text-sm text-white/60">
                          Email notifications are always available. Link Discord to enable instant pings.
                        </p>
                      </div>
                    </section>
                  )}

                  {activeTab === "clan" && (
                    <section className="space-y-8">
                      <header className="flex items-center gap-3 text-white">
                        <FaUsersCog className="text-xl text-amber-300" />
                        <div>
                          <h3 className="text-xl font-semibold">Clan services</h3>
                          <p className="text-sm text-white/60">
                            Coordinate upcoming wars, share strategies, and distribute invites.
                          </p>
                        </div>
                      </header>

                      <form
                        className="space-y-4 rounded-2xl border border-white/10 bg-black/40 p-6"
                        onSubmit={(event) => event.preventDefault()}
                      >
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="flex flex-col gap-2 text-sm text-white/70">
                            War start
                            <input
                              type="datetime-local"
                              value={clanServicesState.warDate}
                              onChange={(event) => handleClanServicesChange("warDate", event.target.value)}
                              className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white focus:border-amber-300 focus:outline-none"
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-sm text-white/70">
                            Invite link
                            <input
                              type="url"
                              placeholder="https://link.clashofclans.com/invite"
                              value={clanServicesState.inviteLink}
                              onChange={(event) => handleClanServicesChange("inviteLink", event.target.value)}
                              className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white focus:border-amber-300 focus:outline-none"
                            />
                          </label>
                        </div>
                        <label className="flex flex-col gap-2 text-sm text-white/70">
                          War plan notes
                          <textarea
                            rows={4}
                            placeholder="Outline attack order, preferred targets, and fallback plans..."
                            value={clanServicesState.warNotes}
                            onChange={(event) => handleClanServicesChange("warNotes", event.target.value)}
                            className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white focus:border-amber-300 focus:outline-none"
                          />
                        </label>
                        <label className="flex flex-col gap-2 text-sm text-white/70">
                          Strategy pack title
                          <input
                            type="text"
                            placeholder="Legends League Hybrid v2"
                            value={clanServicesState.strategyName}
                            onChange={(event) => handleClanServicesChange("strategyName", event.target.value)}
                            className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white focus:border-amber-300 focus:outline-none"
                          />
                        </label>
                        <label className="flex flex-col gap-2 text-sm text-white/70">
                          Upload strategy file
                          <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              setUploadedStrategyFile(file ? file.name : null);
                            }}
                            className="rounded-xl border border-dashed border-white/20 bg-black/60 px-4 py-3 text-white focus:border-amber-300 focus:outline-none"
                          />
                        </label>
                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/60">
                          <p>
                            {uploadedStrategyFile
                              ? `Ready to share: ${uploadedStrategyFile}`
                              : "Attach your latest attack guide for co-leaders."}
                          </p>
                          <button
                            type="submit"
                            className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black transition hover:bg-emerald-400"
                          >
                            Save plan (local)
                          </button>
                        </div>
                      </form>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h4 className="text-base font-semibold text-white">Coordination tips</h4>
                        <ul className="mt-4 space-y-2 text-sm text-white/70">
                          <li>Share saved plans with elders to confirm attack assignments.</li>
                          <li>Use linked Discord webhooks to broadcast the invite link.</li>
                          <li>Set notification reminders 24 hours before war start time.</li>
                        </ul>
                      </div>
                    </section>
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
