


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
      // { label: "FAQ", href: "#faq" },
      { label: "About us", href: "/about" },
      // { label: "Strategy hub", href: "/#hub" },
      // { label: "Feature requests", href: "#features" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

const socials = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@l9q",
    icon: FaYoutube,
    accent: "hover:text-rose-400 focus-visible:outline-rose-500",
  },
  {
    name: "Telegram",
    href: "https://t.me/clashvip",
    icon: FaTelegram,
    accent: "hover:text-sky-400 focus-visible:outline-sky-500",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@clash",
    icon: FaTiktok,
    accent: "hover:text-white focus-visible:outline-slate-300",
  },
  {
    name: "Discord",
    href: "https://discord.gg/F55tXqKdJq",
    icon: FaDiscord,
    accent: "hover:text-indigo-400 focus-visible:outline-indigo-500",
  },
];

const Footer = () => (
  <footer className="relative border-t border-white/10 bg-slate-950 text-slate-300">
    {/* Gradient background */}
    <div
      className="absolute inset-x-0 -top-20 z-0 h-20 bg-gradient-to-b from-sky-500/20 via-transparent to-transparent"
      aria-hidden="true"
    />

    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-12 pt-14">
      {/* Top Section */}
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        {/* Brand */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-lg">
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-400/20 text-sky-300 text-lg font-bold">
                RC
              </div>
              <span className="text-2xl font-semibold text-white tracking-wide">
                clashvip
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-300/90">
              Track elite clan performance, monitor donation momentum, and
              coordinate your next push with a control hub built for competitive
              Clash of Clans players.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-slate-400">
              <span className="rounded-full border border-white/10 px-3 py-1 shadow-sm">
                War room ready
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 shadow-sm">
                Realtime lookups
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 shadow-sm">
                Community first
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid gap-8 sm:grid-cols-2">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
                {group.title}
              </h2>
              <ul className="space-y-3 text-sm text-slate-300/90">
                {group.links.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="inline-flex items-center gap-2 transition-all hover:text-white hover:translate-x-1"
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

      {/* Bottom Section */}
      <div className="flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-400 space-y-2">
          <p>
            This material is unofficial and is not endorsed by Supercell.{" "}
            <a
              href="https://supercell.com/en/fan-content-policy/"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-sky-300"
            >
              Supercell's Fan Content Policy
            </a>
            .
          </p>
          <p>
            Author: <span className="text-white">ClashVIP.io</span> (Sattam – Owner & Founder) <br />
            © {new Date().getFullYear()} <span className="text-white">ClashVIP.io</span> – All rights reserved
          </p>
        </div>

        <div className="flex items-center gap-4">
          {socials.map(({ name, href, icon, accent }) => {
            const IconComponent = icon;
            return (
              <a
                key={name}
                href={href}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-slate-300 transition-all hover:scale-110 hover:shadow-lg focus-visible:outline focus-visible:outline-offset-2 ${accent}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open clashvip on ${name}`}
              >
                <IconComponent size={20} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
