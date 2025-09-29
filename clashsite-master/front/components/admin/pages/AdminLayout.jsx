import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Users from "./Users";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const navigate = useNavigate();

  const handleSignOut = () => {
    Cookies.remove("accessToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className=" w-72 shrink-0 md:flex md:flex-col md:gap-6">
          <div className="rounded-3xl border border-white/5 bg-slate-950/70 p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-lg font-semibold text-sky-300">
                RC
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                  Admin
                </p>
                <p className="text-base font-semibold text-white">clashvip</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => setActiveTab("users")}
              className={`rounded-2xl border border-white/5 p-4 text-start transition ${
                activeTab === "users"
                  ? "bg-sky-500/15 text-white shadow-lg shadow-sky-900/30"
                  : "bg-slate-950/60 text-slate-300 hover:bg-slate-900/60"
              }`}
            >
              <p className="text-sm font-semibold">Users</p>
              <p className="mt-1 text-xs text-slate-400">
                Manage users - add, edit, or remove accounts.
              </p>
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 w-full">
          <header className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-slate-950/80 px-5 py-4 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.8)] sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
            <div>
              <h1 className="text-2xl font-semibold text-white capitalize">
                {activeTab}
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-rose-400"
              >
                Sign Out
              </button>
            </div>
          </header>

          <section className="mt-6 rounded-3xl border border-white/5 bg-slate-950/70 p-4 shadow-xl sm:p-8">
            {activeTab === "users" && <Users />}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
