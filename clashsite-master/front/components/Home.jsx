import { useEffect, useState } from "react";

import { FaYoutube, FaTelegram, FaTiktok, FaDiscord } from "react-icons/fa";

import Player from "./search/Player";
import MySelectByCountry from "./search/MySelectByCountry";
import Clan from "./search/Clan";
import Clansdonatin from "./clansdonatin/Clansdonatin";
import PageShell, { PageSection, SectionHeader } from "./layouts/PageShell";

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
    description:
      "Instant notifications for clan sign-ups, patch alerts, and giveaways.",
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
    description:
      "Short, high-impact tips and deck ideas optimized for mobile viewing.",
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
    description:
      "Coordinate war attacks, share bases, and hang out with the clashvip crew.",
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
          <span className="sr-only">
            Play the latest Clash Pro YouTube video
          </span>
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
      <figcaption className="sr-only">
        Lazy-loaded YouTube embed for Clash Pro.
      </figcaption>
    </figure>
  );
};

const Home = () => {
  // const { t, direction } = useLanguage();

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

  // const heroSubtitle =
  //   "Search players, clans, and donation leaders from one responsive dashboard.";
  const searchTitle = "Powerful lookup tools";
  const searchSubtitle =
    "Start here to find the right player, clan, or donation leaderboard without leaving the page.";
  const donationTitle = "Top donation leaderboards";
  const donationSubtitle =
    "Track weekly donation momentum and spotlighted clans inside a single panel.";
  const communityTitle = "Community highlights";
  const communitySubtitle =
    "Weekly blurbs inspired by Top Req Clans celebrate real donation pushes and capital sweeps.";
  const followTitle = "Follow Clash Pro everywhere";
  const followSubtitle =
    "We use lightweight embeds, lazy loading, and structured data so the homepage stays fast even with rich media.";

  const [device, setDevice] = useState("desktop"); // desktop | tablet | mobile

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDevice("mobile");
      } else if (width < 1024) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  const videoSrc =
    device === "mobile"
      ? "/Mobile.mp4"
      : device === "tablet"
      ? "/Tablet.mp4"
      : "/Desktop.mp4";

  return (
    <PageShell className="w-full" padded={false} fullWidth variant="plain">
      <div className="flex flex-col gap-16 pb-20 text-slate-100">
        {/* ====== HERO SECTION ====== */}
        <section className="relative overflow-hidden min-h-[80vh] sm:min-h-[90vh] md:min-h-screen">
          {/* ====== VIDEO BACKGROUND ====== */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />

          {/* طبقة شفافة فوق الفيديو */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* ====== BLUR SHAPES (اختياري) ====== */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
            aria-hidden="true"
          >
            <div className="absolute left-1/4 top-[-10rem] h-72 w-72 rounded-full bg-amber-500/10" />
            <div className="absolute right-[-6rem] bottom-[-12rem] h-80 w-80 rounded-full bg-sky-500/10" />
          </div>

          {/* ====== CONTENT ====== */}
        </section>

        {/* ====== SEARCH SECTION ====== */}
        <PageSection
          id="search"
          className="mx-auto w-full max-w-6xl px-4 space-y-10"
        >
          <SectionHeader
            className="w-full"
            align="center"
            title={searchTitle}
            description={searchSubtitle}
          />
          <MyTabs />
        </PageSection>

        {/* ====== DONATIONS SECTION ====== */}
        <PageSection
          id="donations"
          className="mx-auto w-full max-w-6xl px-4 space-y-8"
        >
          <SectionHeader
            title={donationTitle}
            description={donationSubtitle}
            align="start"
          />
          <div className="glass-panel border-white/5 bg-slate-950/80 p-4 w-full">
            <Clansdonatin />
          </div>
        </PageSection>

        {/* ====== COMMUNITY SECTION ====== */}
        <PageSection className="mx-auto w-full max-w-6xl px-4 space-y-8">
          <SectionHeader
            title={communityTitle}
            description={communitySubtitle}
            align="start"
          />
          <div className="grid gap-4 text-sm text-slate-200 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="glass-panel border-white/5 bg-slate-950/75 p-5">
              <p>
                - Rising clan of the week highlighted atop the donation board.
              </p>
            </div>
            <div className="glass-panel border-white/5 bg-slate-950/75 p-5">
              <p>- Capital raid MVPs featured in the analytics panel.</p>
            </div>
            <div className="glass-panel border-white/5 bg-slate-950/75 p-5">
              <p>
                - Seasonal goals to share across Telegram, TikTok, and YouTube.
              </p>
            </div>
          </div>
        </PageSection>

        {/* ====== FOLLOW SECTION ====== */}
        <PageSection
          id="follow"
          className="mx-auto w-full max-w-6xl px-4 space-y-8"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
            <div className="space-y-6">
              <SectionHeader
                title={followTitle}
                description={followSubtitle}
                align="start"
              />
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Built with schema.org guidance and web.dev lazy-load patterns.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {socialChannels.map(
                  ({
                    name,
                    href,
                    description,
                    icon,
                    metric,
                    ringClass,
                    badgeClass,
                    badgeTextClass,
                    actionLabel,
                  }) => {
                    const Icon = icon;
                    return (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className={`group flex flex-col justify-between glass-panel border-white/5 bg-slate-900/80 p-6 transition hover:-translate-y-1 ${ringClass}`}
                        aria-label={`Open Clash Pro on ${name}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/80 text-2xl text-white transition group-hover:scale-105">
                            <Icon aria-hidden="true" />
                          </span>
                          <div>
                            <p className="text-lg font-semibold text-white">
                              {name}
                            </p>
                            <p className="text-sm text-slate-400">{metric}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-400 transition group-hover:text-slate-200">
                          {description}
                        </p>
                        <span
                          className={`mt-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeClass} ${badgeTextClass}`}
                        >
                          {actionLabel}
                          <span aria-hidden="true">&gt;</span>
                        </span>
                      </a>
                    );
                  }
                )}
              </div>
            </div>
            <div className="space-y-3">
              <LazyYouTubeEmbed className="w-full" />
              <p className="text-xs text-slate-400">
                The player mounts after interaction, saving requests while
                keeping the page fast.
              </p>
            </div>
          </div>
        </PageSection>
      </div>
    </PageShell>
  );
};

export default Home;

function MyTabs() {
  const [activeTab, setActiveTab] = useState("player");

  const tabButtonClass = (tab) =>
    `flex-1 px-4 py-2 text-center rounded-lg font-medium transition 
     ${
       activeTab === tab
         ? "bg-amber-500 text-slate-900 shadow-md" // التاب النشط
         : "bg-slate-800/70 text-slate-200 hover:bg-slate-700/80" // العادي
     }`;

  return (
    <div className="space-y-6">
      {/* أزرار التاب */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          onClick={() => setActiveTab("player")}
          className={tabButtonClass("player")}
        >
          Player
        </button>
        <button
          onClick={() => setActiveTab("country")}
          className={tabButtonClass("country")}
        >
          By Country
        </button>
        <button
          onClick={() => setActiveTab("clan")}
          className={tabButtonClass("clan")}
        >
          Clan
        </button>
      </div>

      {/* محتوى التاب */}
      <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5 shadow-lg">
        {activeTab === "player" && <Player />}
        {activeTab === "country" && <MySelectByCountry />}
        {activeTab === "clan" && <Clan />}
      </div>
    </div>
  );
}
