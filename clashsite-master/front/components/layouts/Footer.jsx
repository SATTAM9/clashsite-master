import { FaYoutube, FaTelegram, FaTiktok, FaDiscord } from "react-icons/fa";

const navigationGroups = [
  {
    title: "Discover",
    links: [
      { label: "Home", href: "/" },
      { label: "Players", href: "/players/player" },
      { label: "Clans", href: "/clans/clan" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "About us", href: "#about" },
      { label: "Strategy hub", href: "/#hub" },
      { label: "Feature requests", href: "#features" },
      { label: "Privacy", href: "#privacy" },
    ],
  },
];

const socials = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@l9q",
    icon: FaYoutube,
    accent: "hover:text-rose-300 focus-visible:outline-rose-400",
  },
  {
    name: "Telegram",
    href: "https://t.me/clashvip",
    icon: FaTelegram,
    accent: "hover:text-sky-200 focus-visible:outline-sky-400",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@clash",
    icon: FaTiktok,
    accent: "hover:text-slate-100 focus-visible:outline-slate-200",
  },
  {
    name: "Discord",
    href: "https://discord.gg/F55tXqKdJq",
    icon: FaDiscord,
    accent: "hover:text-indigo-200 focus-visible:outline-indigo-400",
  },
];

const Footer = () => (
  <footer className="relative border-t border-white/10 bg-slate-950/70 text-slate-300 backdrop-blur">
    <div
      className="absolute inset-x-0 -top-24 z-0 h-24 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent"
      aria-hidden="true"
    />
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="glass-panel border-white/5 bg-slate-900/60 p-8">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/20 text-sky-300">
                RC
              </div>
              <span className="text-xl font-semibold text-white">clashvip</span>
            </div>
            <p className="max-w-md text-sm text-slate-300/90">
              Track elite clan performance, monitor donation momentum, and
              coordinate your next push with a control hub built for competitive
              Clash of Clans players.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-500">
              <span className="rounded-full border border-white/5 px-3 py-1">
                War room ready
              </span>
              <span className="rounded-full border border-white/5 px-3 py-1">
                Realtime lookups
              </span>
              <span className="rounded-full border border-white/5 px-3 py-1">
                Community first
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                {group.title}
              </h2>
              <ul className="space-y-3 text-sm text-slate-300/90">
                {group.links.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="inline-flex items-center gap-2 transition hover:text-white hover:pl-1"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-sky-400/70"
                        aria-hidden="true"
                      />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span>
            Copyright {new Date().getFullYear()} clashvip. All rights reserved.
          </span>
          <span
            className="hidden sm:inline-block h-1 w-1 rounded-full bg-slate-600"
            aria-hidden="true"
          />
          <a href="#privacy" className="hover:text-white">
            Privacy
          </a>
          <a href="#terms" className="hover:text-white">
            Terms
          </a>
        </div>
        <div className="flex items-center gap-4">
          {socials.map(({ name, href, icon, accent }) => {
            const IconComponent = icon;
            return (
              <a
                key={name}
                href={href}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-offset-2 ${accent}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open clashvip on ${name}`}
              >
                <IconComponent size={18} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
