import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getStoredUser } from "../../lib/adminAuth";

const navItems = [
  {
    to: "/admin",
    label: "Overview",
    description: "Monitor ReqClans performance and health.",
    exact: true,
  },
  {
    to: "/admin/content",
    label: "Content Studio",
    description: "Manage the hero banner and featured links.",
  },
  {
    to: "/admin/donations",
    label: "Donations",
    description: "Curate clans for the donations leaderboard.",
  },
  {
    to: "/admin/players",
    label: "Players",
    description: "Player management coming soon.",
    disabled: true,
  },
  {
    to: "/admin/settings",
    label: "Settings",
    description: "Configuration tools coming soon.",
    disabled: true,
  },
];

const titleByPath = {
  "/admin": "Overview",
  "/admin/content": "Content Studio",
  "/admin/donations": "Donation Tracker",
  "/admin/players": "Player Management",
  "/admin/settings": "Settings",
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useMemo(() => getStoredUser(), []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const currentTitle = titleByPath[location.pathname] || "Overview";

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 md:flex md:flex-col md:gap-6">
          <div className="rounded-3xl border border-white/5 bg-slate-950/70 p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-lg font-semibold text-sky-300">
                RC
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                  Admin
                </p>
                <p className="text-base font-semibold text-white">ReqClans</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Stay on top of every API update and content change without leaving this dashboard. Use the tools on the right to move between analytics, players, and content editing.
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              const baseClasses = "rounded-2xl border border-white/5 p-4 text-start transition";
              const activeClasses = isActive
                ? "bg-sky-500/15 text-white shadow-lg shadow-sky-900/30"
                : "bg-slate-950/60 text-slate-300 hover:bg-slate-900/60";
              const disabledClasses = "opacity-40 cursor-not-allowed";

              if (item.disabled) {
                return (
                  <div
                    key={item.to}
                    className={`${baseClasses} ${disabledClasses}`}
                    aria-disabled="true"
                  >
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`${baseClasses} ${activeClasses}`}
                  end={item.exact}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-slate-950/80 px-5 py-4 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.8)] sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-slate-500">
                Admin Portal
              </p>
              <h1 className="text-2xl font-semibold text-white">{currentTitle}</h1>
            </div>
            <div className="flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:items-center sm:gap-4">
              <div className="text-right sm:text-left">
                <p className="font-semibold text-white">{user?.name || "Admin"}</p>
                <p className="text-xs text-slate-400">{user?.email || "admin@reqclans.com"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:bg-white/10"
                >
                  View Site
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-rose-400"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </header>

          <section className="mt-6 rounded-3xl border border-white/5 bg-slate-950/70 p-4 shadow-xl sm:p-8">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
