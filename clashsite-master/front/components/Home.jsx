import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../src/i18n/LanguageContext";
import { Link } from "react-router-dom";
import { FaYoutube, FaTelegram, FaTiktok, FaDiscord } from "react-icons/fa";
import Carousel from "./ui/Slider";
import Player from "./search/Player";
import MySelectByCountry from "./search/MySelectByCountry";
import Clan from "./search/Clan";
import Clansdonatin from "./clansdonatin/Clansdonatin";

const FEATURE_VIDEO_ID = "eyC6IotF7Bc";

const socialChannels = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@l9q",
    description: "Long-form strategy breakdowns and seasonal change logs.",
    icon: FaYoutube,
    metric: "Guides every week",
    ringClass: "hover:ring-rose-400/60",
    badgeClass:
      "bg-rose-500/90 hover:bg-rose-400 focus-visible:outline-rose-400 focus-visible:outline-offset-2",
    badgeTextClass: "text-white",
    actionLabel: "Watch now",
  },
  {
    name: "Telegram",
    href: "https://t.me/clashvip",
    description: "Instant notifications for clan sign-ups, patch alerts, and giveaways.",
    icon: FaTelegram,
    metric: "Real-time updates",
    ringClass: "hover:ring-sky-400/60",
    badgeClass:
      "bg-sky-500/90 hover:bg-sky-400 focus-visible:outline-sky-400 focus-visible:outline-offset-2",
    badgeTextClass: "text-white",
    actionLabel: "Join channel",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@clash",
    description: "Short, high-impact tips and deck ideas optimized for mobile viewing.",
    icon: FaTiktok,
    metric: "60s highlights",
    ringClass: "hover:ring-slate-200/60",
    badgeClass:
      "bg-slate-200/90 hover:bg-slate-100 focus-visible:outline-slate-200 focus-visible:outline-offset-2",
    badgeTextClass: "text-slate-900",
    actionLabel: "See clips",
  },
  {
    name: "Discord",
    href: "https://discord.gg/F55tXqKdJq",
    description: "Coordinate war attacks, share bases, and hang out with the ReqClans crew.",
    icon: FaDiscord,
    metric: "Live strategy chat",
    ringClass: "hover:ring-indigo-400/60",
    badgeClass:
      "bg-indigo-500/90 hover:bg-indigo-400 focus-visible:outline-indigo-400 focus-visible:outline-offset-2",
    badgeTextClass: "text-white",
    actionLabel: "Join server",
  },
];

const LazyYouTubeEmbed = () => {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const embedUrl = `https://www.youtube.com/embed/${FEATURE_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`;
  const thumbnailUrl = `https://img.youtube.com/vi/${FEATURE_VIDEO_ID}/hqdefault.jpg`;

  return (
    <figure className="group relative aspect-video overflow-hidden rounded-3xl bg-slate-950/40 ring-1 ring-slate-800/60">
      {isPlayerVisible ? (
        <iframe
          src={embedUrl}
          title="Clash Pro latest YouTube update"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlayerVisible(true)}
          className="relative inline-flex h-full w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          <span className="sr-only">Play the latest Clash Pro YouTube video</span>
          <img
            src={thumbnailUrl}
            alt="Clash Pro YouTube preview thumbnail"
            loading="lazy"
            width="1280"
            height="720"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-base font-semibold uppercase tracking-wide text-slate-900 shadow-lg transition group-hover:bg-white group-hover:text-rose-500">
              Play
            </span>
          </span>
        </button>
      )}
      <figcaption className="sr-only">Lazy-loaded YouTube embed for Clash Pro.</figcaption>
    </figure>
  );
};

const Home = () => {
  const { t, direction } = useLanguage();

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const scriptId = "clash-social-schema";
    const siteUrl =
      typeof window !== "undefined" && window.location
        ? window.location.origin
        : "https://clash.pro";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Clash Pro",
      url: siteUrl,
      sameAs: socialChannels.map((channel) => channel.href),
    };

    const serialized = JSON.stringify(schema);
    let script = document.getElementById(scriptId);
    if (script) {
      script.textContent = serialized;
      return;
    }

    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = scriptId;
    script.textContent = serialized;
    document.head.appendChild(script);
  }, []);

  const heroSubtitle = "Search players, clans, and donation leaders from one responsive dashboard.";
  const searchTitle = "Powerful lookup tools";
  const searchSubtitle = "Start here to find the right player, clan, or donation leaderboard without leaving the page.";
  const donationTitle = "Top donation leaderboards";
  const donationSubtitle = "Track weekly donation momentum and spotlighted clans inside a single panel.";
  const communityTitle = "Community highlights";
  const communitySubtitle = "Weekly blurbs inspired by Top Req Clans celebrate real donation pushes and capital sweeps.";
  const followTitle = "Follow Clash Pro everywhere";
  const followSubtitle = "We use lightweight embeds, lazy loading, and structured data so the homepage stays fast even with rich media.";

  const quickLinks = useMemo(
    () => [
      {
        title: "Player lookup",
        description: "Pull full profiles with battle stats in seconds.",
        href: "#search",
      },
      {
        title: "Donation tracking",
        description: "Watch the top clans and weekly momentum by location.",
        href: "#donations",
      },
      {
        title: "Community channels",
        description: "Follow our broadcast lists for breaking alerts and patch day notes.",
        href: "#follow",
      },
    ],
    []
  );

    return (
    <div
      dir={direction}
      className="min-h-screen bg-gradient-to-b from-[#0b1120] via-[#020617] to-[#000000] text-white"
    >
      <section className="relative overflow-hidden py-12">
        <div
          className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
          aria-hidden="true"
        >
          <div className="absolute left-1/4 top-[-10rem] h-72 w-72 rounded-full bg-amber-500/10" />
          <div className="absolute right-[-6rem] bottom-[-12rem] h-80 w-80 rounded-full bg-sky-500/10" />
        </div>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full bg-slate-900/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 ring-1 ring-slate-700/60">
                Clash Pro Control Hub
              </span>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{t("hero.headline")}</h1>
              <p className="max-w-xl text-sm text-slate-200 sm:text-base">{heroSubtitle}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickLinks.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl bg-slate-900/70 p-5 ring-1 ring-slate-800/60 transition hover:-translate-y-1 hover:ring-amber-400/60"
                >
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-xs text-slate-300 transition group-hover:text-slate-200">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-amber-300">
                    Get started
                    <span aria-hidden="true">&gt;</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-slate-950/70 p-4 ring-1 ring-slate-800/50 shadow-xl backdrop-blur">
            <Carousel />
          </div>
        </div>
      </section>

      <section id="search" className="mx-auto max-w-6xl space-y-8 px-4 pb-12">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold text-white">{searchTitle}</h2>
          <p className="text-sm text-slate-300 sm:text-base">{searchSubtitle}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-slate-950/70 p-5 ring-1 ring-slate-800/50 shadow-lg">
            <Player />
          </div>
          <div className="rounded-3xl bg-slate-950/70 p-5 ring-1 ring-slate-800/50 shadow-lg">
            <MySelectByCountry />
          </div>
          <div className="rounded-3xl bg-slate-950/70 p-5 ring-1 ring-slate-800/50 shadow-lg">
            <Clan />
          </div>
        </div>
      </section>

      <section id="donations" className="mx-auto max-w-6xl space-y-6 px-4 pb-12">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-white">{donationTitle}</h2>
          <p className="text-sm text-slate-300 sm:text-base">{donationSubtitle}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/70 p-4 ring-1 ring-slate-800/50 shadow-xl">
          <Clansdonatin />
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 pb-12">
        <div className="flex flex-col gap-6 rounded-3xl bg-slate-950/70 p-8 shadow-xl ring-1 ring-slate-800/50 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white">{communityTitle}</h2>
            <p className="text-slate-200">{communitySubtitle}</p>
          </div>
          <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-2 lg:max-w-xl">
            <div className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-slate-800/40">
              - Rising clan of the week highlighted atop the donation board.
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-slate-800/40">
              - Capital raid MVPs featured in the analytics panel.
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-slate-800/40">
              - Seasonal goals to share across Telegram, TikTok, and YouTube.
            </div>
          </div>
        </div>
      </section>

      <section
        id="follow"
        className="mx-auto max-w-6xl space-y-8 px-4 pb-16"
      >
        <div className="grid gap-8 rounded-3xl bg-slate-950/70 p-8 shadow-xl ring-1 ring-slate-800/50 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white">{followTitle}</h2>
              <p className="text-sm text-slate-300 sm:text-base">{followSubtitle}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Built with schema.org guidance and web.dev lazy-load patterns.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {socialChannels.map((
                { name, href, description, icon, metric, ringClass, badgeClass, badgeTextClass, actionLabel }
              ) => {
                const Icon = icon;
                return (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className={`group flex flex-col justify-between rounded-3xl bg-slate-900/70 p-6 ring-1 ring-slate-800/50 transition hover:-translate-y-1 ${ringClass}`}
                    aria-label={`Open Clash Pro on ${name}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/80 text-2xl text-white transition group-hover:scale-105">
                        <Icon aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-white">{name}</p>
                        <p className="text-sm text-slate-400">{metric}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-400 transition group-hover:text-slate-200">{description}</p>
                    <span
                      className={`mt-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeClass} ${badgeTextClass}`}
                    >
                      {actionLabel}
                      <span aria-hidden="true">&gt;</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
          <div className="space-y-3">
            <LazyYouTubeEmbed />
            <p className="text-xs text-slate-400">
              The player mounts after interaction, saving requests while keeping the page fast.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;








