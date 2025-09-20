import { useMemo, useState } from "react";

const defaultHero = {
  headline: "Welcome to ReqClans",
  subtitle: "Discover elite clans, track stats, and grow your community.",
  ctaLabel: "Explore Clans",
  ctaLink: "/",
};

const defaultQuickLinks = [
  { id: 1, title: "Find a Clan", href: "#search" },
  { id: 2, title: "Donation Tracker", href: "#donations" },
  { id: 3, title: "Follow Updates", href: "#follow" },
];

const defaultSocials = [
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@l9q" },
  { id: "telegram", label: "Telegram", href: "https://t.me/clashvip" },
  { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@clash" },
];

const AdminContent = () => {
  const [hero, setHero] = useState(defaultHero);
  const [quickLinks, setQuickLinks] = useState(defaultQuickLinks);
  const [socialLinks, setSocialLinks] = useState(defaultSocials);
  const [statusMessage, setStatusMessage] = useState(null);

  const disabledActions = useMemo(
    () => ({
      title: "Read-only mode",
      hint: "Connect the upcoming content API before enabling live publishing.",
    }),
    []
  );

  const handleHeroChange = (key, value) => {
    setHero((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuickLinkChange = (id, key, value) => {
    setQuickLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const handleSocialChange = (id, value) => {
    setSocialLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, href: value } : item))
    );
  };

  const handleSaveDraft = () => {
    setStatusMessage({
      type: "draft",
      text: "Draft saved locally. Sync to the live site once the content service is connected.",
    });
  };

  const handlePublish = () => {
    setStatusMessage({
      type: "publish",
      text: "Publishing queued. Wire up the API via CI/CD to push changes to production.",
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 rounded-3xl border border-sky-500/20 bg-sky-500/10 p-5 text-slate-100 shadow-lg shadow-sky-900/20">
        <h2 className="text-lg font-semibold text-white">Content Operations Hub</h2>
        <p className="text-sm text-slate-300">
          Curate the landing experience, promote community updates, and manage the hero banner without leaving this workspace. Future automation hooks will appear here.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-300">
          <span className="rounded-full border border-white/20 px-3 py-1 uppercase tracking-[0.35em]">
            hero
          </span>
          <span className="rounded-full border border-white/20 px-3 py-1 uppercase tracking-[0.35em]">
            quick links
          </span>
          <span className="rounded-full border border-white/20 px-3 py-1 uppercase tracking-[0.35em]">
            socials
          </span>
        </div>
      </header>

      {statusMessage ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            statusMessage.type === "publish"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
              : "border-amber-500/30 bg-amber-500/10 text-amber-100"
          }`}
        >
          {statusMessage.text}
        </div>
      ) : null}

      <section className="rounded-3xl border border-white/5 bg-slate-950/70 p-6 shadow-lg">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Hero Banner (Hero)</h3>
            <p className="text-xs text-slate-400">
              Update the hero copy and primary call to action shown on the public homepage.
            </p>
          </div>
          <span className="rounded-full bg-slate-900/70 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-400">
            {disabledActions.title}
          </span>
        </header>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">
            Headline
            <input
              value={hero.headline}
              onChange={(event) => handleHeroChange("headline", event.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">
            Subheadline
            <input
              value={hero.subtitle}
              onChange={(event) => handleHeroChange("subtitle", event.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">
            Call to Action Label
            <input
              value={hero.ctaLabel}
              onChange={(event) => handleHeroChange("ctaLabel", event.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">
            Destination URL
            <input
              value={hero.ctaLink}
              onChange={(event) => handleHeroChange("ctaLink", event.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-white/5 bg-slate-950/70 p-6 shadow-lg">
        <header className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Featured Quick Links</h3>
            <p className="text-xs text-slate-400">
              Highlight the most helpful resources visitors need in just a click.
            </p>
          </div>
          <span className="rounded-full bg-slate-900/70 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-400">
            {disabledActions.title}
          </span>
        </header>

        <div className="mt-4 space-y-3">
          {quickLinks.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:grid-cols-[1fr_1fr]"
            >
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">
                Title
                <input
                  value={item.title}
                  onChange={(event) =>
                    handleQuickLinkChange(item.id, "title", event.target.value)
                  }
                  className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">
                URL
                <input
                  value={item.href}
                  onChange={(event) =>
                    handleQuickLinkChange(item.id, "href", event.target.value)
                  }
                  className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/5 bg-slate-950/70 p-6 shadow-lg">
        <header className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Social Profiles</h3>
            <p className="text-xs text-slate-400">
              Keep your audience connected across platforms with current social links.
            </p>
          </div>
          <span className="rounded-full bg-slate-900/70 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-400">
            {disabledActions.hint}
          </span>
        </header>

        <div className="mt-4 space-y-3">
          {socialLinks.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:grid-cols-[0.4fr_1fr]"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-200">
                  {item.label}
                </span>
              </div>
              <input
                value={item.href}
                onChange={(event) => handleSocialChange(item.id, event.target.value)}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          ))}
        </div>
      </section>

      <footer className="flex flex-col gap-3 rounded-3xl border border-white/5 bg-slate-950/70 p-5 shadow-lg text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-400">
            Content updates currently rely on the upcoming endpoint. Continue manual updates until the pipeline is configured.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:bg-white/10"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-sky-400"
          >
            Publish Update
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AdminContent;

