const quickStats = [
  {
    label: "Total Visits",
    value: "12.4k",
    delta: "+8.2%",
    description: "Compared to last month",
    accent: "text-sky-300",
  },
  {
    label: "Returning Players",
    value: "3.9k",
    delta: "+4.1%",
    description: "Increase over the last 24 hours",
    accent: "text-emerald-300",
  },
  {
    label: "New Signups",
    value: "486",
    delta: "-1.9%",
    description: "Week-over-week change",
    accent: "text-amber-300",
  },
  {
    label: "Open Tickets",
    value: "32",
    delta: "+12.5%",
    description: "Active support conversations",
    accent: "text-rose-300",
  },
];

const activityFeed = [
  {
    title: "New clan application reviewed",
    actor: "Salem (Moderator)",
    time: "12 minutes ago",
    detail: "Approved WarKings after verifying their donation history.",
  },
  {
    title: "API sync deployed",
    actor: "Req API",
    time: "1 hour ago",
    detail: "Pushed a data refresh for clan #P0LYR8 to update donation totals.",
  },
  {
    title: "Legend league spotlight",
    actor: "Content team",
    time: "3 hours ago",
    detail: "Published a highlight reel covering the top ten ranked players.",
  },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((item) => (
          <article
            key={item.label}
            className="rounded-3xl border border-white/5 bg-slate-950/70 p-5 shadow-lg shadow-slate-950/30"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              {item.label}
            </p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-white">{item.value}</span>
              <span className={`text-xs font-semibold ${item.accent}`}>{item.delta}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <article className="rounded-3xl border border-white/5 bg-slate-950/70 p-6 shadow-lg">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Performance Overview</h2>
              <p className="text-xs text-slate-400">
                Keep your community growing with a live snapshot of the KPIs that matter.
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
            >
              View report
            </button>
          </header>

          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-4">
              <p className="text-slate-200">
                Donation activity across the top 20 clans jumped by
                <span className="text-sky-300"> 6% </span>
                after the latest API refresh. Highlight the surge to keep members engaged.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-4">
              <p>
                Average session length climbed <span className="text-emerald-300">+14%</span>
                week over week as players explored the new clan finder.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-4">
              <p>
                We resolved <span className="text-rose-300">5 support cases</span> faster this week. Continue showcasing verified clans to keep toxicity low.
              </p>
            </div>
          </div>
        </article>

        <aside className="rounded-3xl border border-white/5 bg-slate-950/70 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <ul className="mt-5 space-y-4 text-sm text-slate-300">
            {activityFeed.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-white/5 bg-slate-950/60 p-4"
              >
                <p className="text-slate-200">{item.title}</p>
                <p className="text-xs text-slate-400">
                  {item.actor} - {item.time}
                </p>
                <p className="mt-2 text-xs text-slate-400">{item.detail}</p>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
};

export default AdminDashboard;
