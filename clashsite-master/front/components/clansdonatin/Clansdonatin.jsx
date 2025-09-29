import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
const CACHE_KEY = "clansDataCache";
const CACHE_DURATION = 60 * 1 * 1000;

const TEXT = {
  title: "Clan Donations Ranking",
  subtitle: (count) => `Showing top ${count} clans per page`,
  loading: "Loading...",
  errorFallback: "Failed to load clans data.",
  prev: "Prev",
  next: "Next",
  rank: "Rank",
  clan: "Clan",
  donated: "Donated",
  received: "Received",
  seasonTotal: "Total (Season)",
  daily: "Daily Donations",
  unavailable: "Unavailable",
  noResults: "No donation data available right now.",
  pageInfo: (current, total) => `Page ${current} of ${total}`,
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const ITEMS_PER_PAGE = 25;

const getSeasonDayCount = () => {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
  );
  const diff = now.getTime() - start.getTime();
  return Math.max(1, Math.floor(diff / MS_PER_DAY) + 1);
};

function formatNumber(value, locale = "en") {
  if (value == null || Number.isNaN(Number(value))) return "0";
  try {
    return Number(value).toLocaleString(locale);
  } catch {
    return String(value);
  }
}

const Clansdonatin = () => {
  const locale = "en";
  const [clans, setClans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

  const seasonDayCount = useMemo(() => getSeasonDayCount(), []);

  useEffect(() => {
    let active = true;

    const getClans = async () => {
      try {
        setLoading(true);
        setError(null);

        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { ts, data } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_DURATION) {
            setClans(data);
            setLoading(false);
            setSecondsSinceUpdate(0);
            return;
          }
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/donationsclans`
        );
        const data = await response.json();

        if (!active) return;

        if (data.success && Array.isArray(data.clansranking)) {
          const normalized = data.clansranking
            .map((entry, idx) => {
              if (!Array.isArray(entry)) return null;

              const [
                logoHTML,
                nameAndTag,
                totalDonations,
                totalDonationsReceived,
                totalSeasonDonations,
                averageDailyDonations,
                rawTag,
                badgeUrl,
                clanName,
              ] = entry;

              const rawTagString = String(rawTag || "").trim();
              const cleanedTag = rawTagString.replace(/^#/, "");
              const donatedValue = Number(totalDonations) || 0;
              const receivedValue = Number(totalDonationsReceived) || 0;
              const seasonValue =
                Number(totalSeasonDonations) || donatedValue + receivedValue;
              const dailyValue =
                Number(averageDailyDonations) ||
                Math.round(seasonValue / seasonDayCount);
              const [nameFromMarkup = ""] = String(nameAndTag || "").split(
                "<br>"
              );
              const safeName = String(
                clanName || nameFromMarkup || rawTagString || "Unknown Clan"
              ).trim();
              const safeBadge = String(badgeUrl || "").trim();

              return {
                id: cleanedTag || rawTagString || `clan-${idx}`,
                logoHTML: String(logoHTML || ""),
                badgeUrl: safeBadge,
                name: safeName,
                tag: cleanedTag,
                displayTag:
                  rawTagString || (cleanedTag ? `#${cleanedTag}` : ""),
                totalDonations: donatedValue,
                totalDonationsReceived: receivedValue,
                totalSeasonDonations: seasonValue,
                averageDailyDonations: dailyValue,
              };
            })
            .filter(Boolean);

          setClans(normalized);
          setCurrentPage(1);

          // 🟢 تعديل: نخزن البيانات في الكاش مع timestamp
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ ts: Date.now(), data: normalized })
          );
          setSecondsSinceUpdate(0);
        } else {
          setError({ type: "server", message: data.message });
        }
      } catch (err) {
        console.error("Failed to load clans", err);
        setError({
          type: "network",
          details: err instanceof Error ? err.message : "",
        });
      } finally {
        if (active) setLoading(false);
      }
    };

    getClans();

    return () => {
      active = false;
    };
  }, [seasonDayCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSinceUpdate((prev) => (prev >= 60 ? 0 : prev + 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const sortedClans = useMemo(
    () =>
      [...clans].sort(
        (a, b) =>
          (b?.totalSeasonDonations || 0) - (a?.totalSeasonDonations || 0)
      ),
    [clans]
  );

  const currentClans = sortedClans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(
    1,
    Math.ceil(sortedClans.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const aggregateStats = useMemo(() => {
    if (!sortedClans.length) {
      return {
        totalDonations: 0,
        averageDaily: 0,
        bestDaily: 0,
      };
    }

    const totals = sortedClans.reduce(
      (acc, clan) => {
        const daily = Number(clan.averageDailyDonations) || 0;
        acc.totalSeason += Number(clan.totalSeasonDonations) || 0;
        acc.totalDaily += daily;
        acc.bestDaily = Math.max(acc.bestDaily, daily);
        return acc;
      },
      { totalSeason: 0, totalDaily: 0, bestDaily: 0 }
    );

    return {
      totalDonations: totals.totalSeason,
      averageDaily: totals.totalDaily / sortedClans.length,
      bestDaily: totals.bestDaily,
    };
  }, [sortedClans]);

  let derivedErrorMessage = "";
  if (error) {
    if (error.type === "server") {
      const message =
        typeof error.message === "string" ? error.message.trim() : "";
      derivedErrorMessage = message.length > 0 ? message : TEXT.errorFallback;
    } else {
      const detail =
        error.details && typeof error.details === "string"
          ? error.details.trim()
          : "";
      derivedErrorMessage = `${TEXT.errorFallback}${
        detail.length ? ` (${detail})` : ""
      }`;
    }
  }

  const highlightCards = [
    {
      title: "Total donations logged",
      value: formatNumber(aggregateStats.totalDonations, locale),
      hint: "Across all ranked clans",
    },
    {
      title: "Average daily per clan",
      value: `${formatNumber(
        Math.round(aggregateStats.averageDaily),
        locale
      )} XP`,
      hint: "Based on current leaderboard",
    },
    {
      title: "Best 24h streak",
      value: `${formatNumber(aggregateStats.bestDaily, locale)} XP`,
      hint: sortedClans[0]?.name ? `Led by ${sortedClans[0].name}` : "",
    },
    {
      title: "Clans tracked",
      value: formatNumber(sortedClans.length, locale),
      hint: "Updated hourly",
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pageDescriptor = useMemo(() => {
    const start = sortedClans.length === 0 ? 0 : indexOfFirstItem + 1;
    const end = Math.min(indexOfLastItem, sortedClans.length);
    return `${start}-${end}`;
  });

  return (
    <section className="space-y-10">
      {/*  العداد */}
      <p
        className=" pl-[23px]
  text-slate-400  
  font-bold           
  flex items-center gap-2 
  mt-2"
      >
        ⏱ Last updated {secondsSinceUpdate}s ago
      </p>

      <div className="overflow-hidden rounded-3xl bg-slate-950/75 p-8 shadow-2xl ring-1 ring-slate-800/50">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full bg-slate-900/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 ring-1 ring-slate-700/60">
              {TEXT.title}
            </span>
            <h2 className="text-3xl font-bold text-white">
              {TEXT.subtitle(ITEMS_PER_PAGE)}
            </h2>
            <p className="text-sm text-slate-300">
              Live donation momentum from the last clan war season. Use the
              table to inspect badges, tag links, and daily averages at a
              glance.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/60 px-4 py-3 text-sm text-slate-200 ring-1 ring-slate-700/60">
            <p className="font-semibold">
              {TEXT.pageInfo(currentPage, totalPages)}
            </p>
            <p className="text-xs text-slate-400">
              Showing clans {pageDescriptor}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlightCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-slate-900/60 p-5 ring-1 ring-slate-800/50"
            >
              <p className="text-xs uppercase tracking-wider text-slate-400">
                {card.title}
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {card.value}
              </p>
              {card.hint ? (
                <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-slate-950/70 p-8 text-center text-slate-200 shadow-xl ring-1 ring-slate-800/50">
          <p>{TEXT.loading}</p>
        </div>
      ) : derivedErrorMessage ? (
        <div className="rounded-3xl bg-slate-950/70 p-8 text-center text-red-300 shadow-xl ring-1 ring-slate-800/50">
          <p>{derivedErrorMessage}</p>
        </div>
      ) : currentClans.length === 0 ? (
        <div className="rounded-3xl bg-slate-950/70 p-8 text-center text-slate-200 shadow-xl ring-1 ring-slate-800/50">
          <p>{TEXT.noResults}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-slate-950/70 shadow-xl ring-1 ring-slate-800/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900/80 text-slate-200">
                <tr className="text-left text-xs uppercase tracking-wide">
                  <th className="px-4 py-3">{TEXT.rank}</th>
                  <th className="px-4 py-3">{TEXT.clan}</th>
                  <th className="px-4 py-3">{TEXT.donated}</th>
                  <th className="px-4 py-3">{TEXT.received}</th>
                  <th className="px-4 py-3">{TEXT.seasonTotal}</th>
                  <th className="px-4 py-3">{TEXT.daily}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                {currentClans.map((clan, index) => {
                  const rankPosition = indexOfFirstItem + index + 1;
                  const topRankRowClasses = [
                    "bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-900/80 border border-amber-400/20 text-white hover:from-amber-500/25 hover:via-amber-500/15 hover:to-slate-900/90",
                    "bg-gradient-to-r from-sky-500/20 via-sky-500/10 to-slate-900/80 border border-sky-400/20 text-white hover:from-sky-500/25 hover:via-sky-500/15 hover:to-slate-900/90",
                    "bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-slate-900/80 border border-emerald-400/20 text-white hover:from-emerald-500/25 hover:via-emerald-500/15 hover:to-slate-900/90",
                    "bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-slate-900/80 border border-purple-400/20 text-white hover:from-purple-500/25 hover:via-purple-500/15 hover:to-slate-900/90",
                  ];
                  const zebraRowClass =
                    index % 2 === 0
                      ? "bg-slate-950/40 text-slate-200 hover:bg-slate-900/70"
                      : "bg-slate-900/40 text-slate-200 hover:bg-slate-900/70";
                  const highlightRowClass =
                    rankPosition <= 4
                      ? topRankRowClasses[rankPosition - 1]
                      : zebraRowClass;
                  const fallbackSrcMatch = clan.badgeUrl
                    ? null
                    : clan.logoHTML.match(/src="([^"]*)"/i);
                  const badgeSrc =
                    clan.badgeUrl ||
                    (fallbackSrcMatch ? fallbackSrcMatch[1] : "");
                  const badgeNode = badgeSrc ? (
                    <img
                      src={badgeSrc}
                      alt={`${clan.name} badge`}
                      className="h-10 w-10 rounded object-contain"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-900/60 text-xs text-slate-500">
                      --
                    </div>
                  );
                  const clanDetails = (
                    <>
                      {badgeNode}
                      <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-white">
                          {clan.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {clan.displayTag || TEXT.unavailable}
                        </span>
                      </div>
                    </>
                  );
                  const linkTarget = clan.tag ? `/clan/${clan.tag}` : null;

                  return (
                    <tr
                      key={clan.id || clan.displayTag || rankPosition}
                      className={`transition ${highlightRowClass}`}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-100">
                        #{rankPosition}
                      </td>
                      <td className="px-4 py-3">
                        {linkTarget ? (
                          <Link
                            to={linkTarget}
                            className="flex items-center gap-3 text-slate-200 transition hover:text-amber-300"
                          >
                            {clanDetails}
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 text-slate-200">
                            {clanDetails}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-200">
                        {formatNumber(clan.totalDonations, locale)}
                      </td>
                      <td className="px-4 py-3 text-slate-200">
                        {formatNumber(clan.totalDonationsReceived, locale)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-300">
                        {formatNumber(clan.totalSeasonDonations, locale)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-sky-300">
                        {formatNumber(clan.averageDailyDonations, locale)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-slate-200 sm:flex-row sm:items-center sm:justify-between">
            <span>{TEXT.pageInfo(currentPage, totalPages)}</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 transition disabled:opacity-40 hover:border-amber-400 hover:text-amber-300"
              >
                {TEXT.prev}
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm transition ${
                    currentPage === i + 1
                      ? "bg-amber-400 text-slate-900"
                      : "border border-slate-700 hover:border-amber-400 hover:text-amber-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 transition disabled:opacity-40 hover:border-amber-400 hover:text-amber-300"
              >
                {TEXT.next}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Clansdonatin;
