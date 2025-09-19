import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CapitalLootChart from "./analytics/CapitalLootChart";
import { ASSET_BASE_URL, LOCAL_ICON_BASE, buildLabelSources, buildLocalFromRemote, createFallbackHandler, dedupeLabels, getImageSource, pickIconUrl } from "../lib/cocAssets";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const formatNumber = (value) => {
  if (value === null || value === undefined) return "--";
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toLocaleString() : value;
};

const getTownHallImage = (level) => {
  if (!level) return "";
  return `${LOCAL_ICON_BASE}/town-hall-pics/town-hall-${level}.png`;
};

const hideImgOnError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.style.visibility = "hidden";
};

const buildBadgeSources = (badge) => {
  if (!badge) return { local: "", remote: "" };
  const remote = badge.large || badge.medium || badge.small || badge.url || "";
  const local = buildLocalFromRemote(remote) || `${LOCAL_ICON_BASE}/badges/${badge.id || ""}.png`;
  return { local, remote };
};

const buildLeagueSources = (league) => {
  if (!league) return { local: "", remote: "" };
  const remote =
    pickIconUrl(league.iconUrls) ||
    league.icon?.medium ||
    league.icon?.small ||
    league.icon?.large ||
    league.icon?.url ||
    (league.id ? `${ASSET_BASE_URL}/leagues/${league.id}.png` : "");
  return { local: "", remote };
};

const buildClanIngameLink = (tag) => {
  if (!tag) return "";
  const normalized = tag.startsWith('#') ? tag : `#${tag}`;
  return `https://link.clashofclans.com/en?action=OpenClanProfile&tag=${encodeURIComponent(normalized)}`;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const getSeasonDayCount = () => {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
  );
  const diff = now.getTime() - start.getTime();
  return Math.max(1, Math.floor(diff / MS_PER_DAY) + 1);
};

const CAPITAL_TAB_ITEMS = [
  { id: "overview", label: "Clan Capital Raids" },
  { id: "trend", label: "Capital Loot Trend" },
  { id: "contributors", label: "Top Contributors" },
  { id: "attack", label: "Attack Log" },
  { id: "defense", label: "Defense Log" },
];

const prettifyText = (value) => {
  if (!value) return "--";
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

const ClanDetails = () => {
  const { tag } = useParams();
  const [clan, setClan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [capitalSeasons, setCapitalSeasons] = useState([]);
  const [capitalLoading, setCapitalLoading] = useState(false);
  const [capitalError, setCapitalError] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const [capitalActiveTab, setCapitalActiveTab] = useState("overview");

  const [nameHistory, setNameHistory] = useState([]);
  const [nameHistoryLoading, setNameHistoryLoading] = useState(false);
  const [nameHistoryError, setNameHistoryError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchClan = async () => {
      setLoading(true);
      setError("");

      const normalizedTag = !tag ? "" : tag.startsWith("#") ? tag : `#${tag}`;
      if (!normalizedTag) {
        setError("Clan tag is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/clanbytagForDetails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tag: normalizedTag }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        if (payload.success) {
          setClan(payload.clanInfo ?? null);
        } else {
          throw new Error(payload.error || "Unable to load clan details.");
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        console.error("clanbytagForDetails", err);
        setClan(null);
        setError("Unable to fetch clan information right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClan();
    return () => {
      controller.abort();
    };
  }, [tag]);

  const badgeSources = useMemo(() => buildBadgeSources(clan?.badge), [clan]);
  const locationName = clan?.location?.name || "--";
  const seasonDayCount = useMemo(() => getSeasonDayCount(), []);
  const locale = 'en';


useEffect(() => {
  if (!clan?.tag) {
    setCapitalSeasons([]);
    return;
  }

  let isCancelled = false;
  const controller = new AbortController();

  const fetchCapitalRaid = async () => {
    setCapitalLoading(true);
    setCapitalError("");

    const normalizedTag = clan.tag.replace(/^#/, "");

    try {
      const response = await fetch(
        `${API_BASE_URL}/clans/${encodeURIComponent(normalizedTag)}/capitalraid?limit=3`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      if (isCancelled) {
        return;
      }

      if (payload.success && Array.isArray(payload.seasons)) {
        setCapitalSeasons(payload.seasons);
      } else {
        setCapitalSeasons([]);
        setCapitalError(payload.error || "Unable to load capital raid data.");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }
      if (!isCancelled) {
        console.error("capitalraid fetch", err);
        setCapitalSeasons([]);
        setCapitalError("Unable to load capital raid data.");
      }
    } finally {
      if (!isCancelled) {
        setCapitalLoading(false);
      }
    }
  };

  fetchCapitalRaid();

  return () => {
    isCancelled = true;
    controller.abort();
  };
}, [clan?.tag]);

  useEffect(() => {
    const normalizedTag = clan?.tag ? clan.tag.replace(/^#/, "") : "";

    if (!normalizedTag) {
      setNameHistory([]);
      setNameHistoryError("");
      setNameHistoryLoading(false);
      return;
    }

    const controller = new AbortController();
    let isCancelled = false;

    const fetchClanHistory = async () => {
      setNameHistoryLoading(true);
      setNameHistoryError("");
      setNameHistory([]);

      try {
        const response = await fetch(
          `${API_BASE_URL}/clans/${encodeURIComponent(normalizedTag)}/history`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        if (isCancelled) {
          return;
        }

        if (payload.success) {
          const entries = Array.isArray(payload.nameChanges) ? payload.nameChanges : [];
          setNameHistory(entries);
        } else {
          setNameHistory([]);
          setNameHistoryError(payload.error || "Unable to load clan history.");
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        if (!isCancelled) {
          console.error("clan history fetch", err);
          setNameHistory([]);
          setNameHistoryError("Unable to load clan history.");
        }
      } finally {
        if (!isCancelled) {
          setNameHistoryLoading(false);
        }
      }
    };

    fetchClanHistory();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [clan?.tag]);

  const latestCapitalSeason = useMemo(
    () =>
      Array.isArray(capitalSeasons) && capitalSeasons.length > 0
        ? capitalSeasons[0]
        : null,
    [capitalSeasons],
  );

  const nameHistoryEntries = useMemo(() => {
    if (!Array.isArray(nameHistory) || !nameHistory.length) {
      return [];
    }

    const seen = new Set();
    const cleaned = [];

    nameHistory.forEach((entry) => {
      if (!entry) {
        return;
      }
      const timestamp = typeof entry.timestamp === "string" ? entry.timestamp.trim() : "";
      if (!timestamp) {
        return;
      }
      const from = typeof entry.from === "string" ? entry.from.trim() : "";
      const to = typeof entry.to === "string" ? entry.to.trim() : "";
      const key = `${timestamp}|${from}|${to}`;
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      cleaned.push({ timestamp, from, to });
    });

    cleaned.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return cleaned;
  }, [nameHistory]);

  const capitalSummaryStats = useMemo(() => {
    if (!latestCapitalSeason) return [];

    const metrics = latestCapitalSeason.metrics || {};
    const raidsValue =
      typeof latestCapitalSeason.raidsCompleted === "number"
        ? latestCapitalSeason.raidsCompleted
        : metrics.calculatedRaidsCompleted;
    const offensiveMedals =
      typeof latestCapitalSeason.offensiveReward === "number" && latestCapitalSeason.offensiveReward > 0
        ? latestCapitalSeason.offensiveReward
        : metrics.calculatedOffensiveRaidMedals;

    return [
      { label: "Raids Completed", value: formatNumber(raidsValue) },
      { label: "Total Attacks", value: formatNumber(latestCapitalSeason.totalAttacks) },
      { label: "Enemy Districts Destroyed", value: formatNumber(latestCapitalSeason.enemyDistrictsDestroyed) },
      { label: "Capital Loot Earned", value: formatNumber(latestCapitalSeason.capitalTotalLoot) },
      { label: "Offensive Raid Medals", value: formatNumber(offensiveMedals) },
      { label: "Defensive Raid Medals", value: formatNumber(latestCapitalSeason.defensiveReward) },
    ];
  }, [latestCapitalSeason]);

  const capitalTrendPoints = useMemo(() => {
    if (!Array.isArray(capitalSeasons) || !capitalSeasons.length) {
      return [];
    }

    const points = capitalSeasons
      .map((season) => {
        const start = season.startTime ? new Date(season.startTime) : null;
        const end = season.endTime ? new Date(season.endTime) : null;
        const baseDate = start && !Number.isNaN(start.getTime()) ? start : end;
        const label = baseDate
          ? baseDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })
          : season.seasonId || "Season";
        const sortKey = baseDate ? baseDate.getTime() : Number.MAX_SAFE_INTEGER;

        const metrics = season.metrics || {};
        const raidsCompleted =
          typeof season.raidsCompleted === "number"
            ? season.raidsCompleted
            : metrics.calculatedRaidsCompleted;

        return {
          label,
          sortKey,
          capitalLoot: Number(season.capitalTotalLoot) || 0,
          raidsCompleted: typeof raidsCompleted === "number" ? raidsCompleted : null,
        };
      })
      .sort((a, b) => a.sortKey - b.sortKey)
      .slice(-6);

    return points.map(({ label, capitalLoot, raidsCompleted }) => ({
      label,
      capitalLoot,
      raidsCompleted,
    }));
  }, [capitalSeasons]);

  const warNarrative = useMemo(() => {
    if (!clan) {
      return null;
    }

    const wins = Number(clan.warWins) || 0;
    const losses = Number(clan.warLosses) || 0;
    const ties = Number(clan.warTies) || 0;
    const totalWars = wins + losses + ties;

    if (!totalWars) {
      return null;
    }

    const winRate = Math.round((wins / totalWars) * 100);
    const streak = Number(clan.warWinStreak) || 0;
    const leagueName = clan.warLeague?.name || "War League";
    const headline = `With ${formatNumber(wins)} war wins and a ${winRate}% win rate, ${clan.name} keeps pressure on every matchup.`;
    const details = [
      `Wars played: ${formatNumber(totalWars)}`,
      `Current league: ${leagueName}`,
      streak > 0
        ? `Active win streak: ${formatNumber(streak)} wars`
        : (wins ? "Latest war result: Victory" : "Latest war result: Ready for the next challenge"),
    ];

    return { headline, details, winRate };
  }, [clan]);

  const warShareUrl = useMemo(() => {
    if (!clan?.name || !clan?.tag || !warNarrative) {
      return "https://twitter.com/intent/tweet?text=Recruiting%20warriors%20in%20Clash%20of%20Clans!";
    }

    const textToShare = encodeURIComponent(
      `Clan ${clan.name} (${clan.tag}) is cruising with a ${warNarrative.winRate}% war win rate! Join the fight.`,
    );

    return `https://twitter.com/intent/tweet?text=${textToShare}`;
  }, [clan, warNarrative]);

  const capitalLogs = useMemo(() => {
    if (!latestCapitalSeason) {
      return { attack: [], defense: [] };
    }

    const summarizeLog = (log, prefix) =>
      (Array.isArray(log) ? log : []).map((entry, index) => {
        const districts = Array.isArray(entry.districts) ? entry.districts : [];
        const totalLooted = districts.reduce((sum, district) => sum + (district.totalLooted || 0), 0);
        const perfectedDistricts = districts.filter((district) => district.destructionPercent === 100).length;

        return {
          ...entry,
          key: `${prefix}-${entry?.defender?.tag || entry?.attacker?.tag || index}-${index}`,
          totalLooted,
          perfectedDistricts,
        };
      });

    return {
      attack: summarizeLog(latestCapitalSeason.attackLog, "attack"),
      defense: summarizeLog(latestCapitalSeason.defenseLog, "defense"),
    };
  }, [latestCapitalSeason]);

  const topContributors = Array.isArray(latestCapitalSeason?.members)
    ? latestCapitalSeason.members.slice(0, 15)
    : [];

  const capitalAttackEntries = capitalLogs.attack.slice(0, 5);
  const capitalDefenseEntries = capitalLogs.defense.slice(0, 5);

  const renderCapitalTabContent = () => {
    switch (capitalActiveTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {capitalSummaryStats.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {capitalSummaryStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-slate-900/70 p-5 ring-1 ring-slate-800/60 transition hover:-translate-y-1 hover:ring-sky-400/60"
                  >
                    <p className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-300">Raid metrics are not available.</p>
            )}
          </div>
        );
      case "trend":
        return (
          <div className="space-y-6">
            {capitalTrendPoints.length ? (
              <CapitalLootChart points={capitalTrendPoints} />
            ) : (
              <p className="text-sm text-slate-300">Capital loot trend data is not available.</p>
            )}
          </div>
        );
      case "contributors":
        return topContributors.length ? (
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Top Contributors</h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead className="bg-slate-900/80 text-slate-300">
                  <tr className="text-left text-xs uppercase tracking-wide">
                    <th className="px-4 py-3">Player</th>
                    <th className="px-4 py-3">Tag</th>
                    <th className="px-4 py-3">Attacks</th>
                    <th className="px-4 py-3">Attack Limit</th>
                    <th className="px-4 py-3">Bonus Limit</th>
                    <th className="px-4 py-3">Looted</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-950/60">
                  {topContributors.map((member, idx) => (
                    <tr
                      key={member.tag}
                      className={`transition hover:bg-slate-900 ${idx % 2 === 0 ? "bg-slate-950/40" : "bg-slate-900/40"}`}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-100">{member.name}</td>
                      <td className="px-4 py-3 text-slate-300">{member.tag}</td>
                      <td className="px-4 py-3 text-slate-300">{formatNumber(member.attacks)}</td>
                      <td className="px-4 py-3 text-slate-300">{formatNumber(member.attackLimit)}</td>
                      <td className="px-4 py-3 text-slate-300">{formatNumber(member.bonusAttackLimit)}</td>
                      <td className="px-4 py-3 text-emerald-300 font-semibold">{formatNumber(member.capitalResourcesLooted)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-300">Top contributor data is not available.</p>
        );
      case "attack":
        return capitalAttackEntries.length ? (
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Attack Log</h4>
            {capitalAttackEntries.map((entry, idx) => (
              <div
                key={entry.key || `attack-${idx}`}
                className="rounded-2xl bg-slate-900/60 p-5 ring-1 ring-slate-800/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-100">{entry.defender?.name || "Unknown Clan"}</p>
                    <p className="text-xs text-slate-400">{entry.defender?.tag || "--"}</p>
                  </div>
                  <div className="text-right text-sm text-slate-300">
                    <p>Attacks: {formatNumber(entry.attackCount)}</p>
                    <p>
                      Districts: {formatNumber(entry.districtsDestroyed)} / {formatNumber(entry.districtCount)}
                    </p>
                    <p>Perfected: {formatNumber(entry.perfectedDistricts)}</p>
                    <p>Loot Gained: {formatNumber(entry.totalLooted)}</p>
                  </div>
                </div>
                {entry.districts && entry.districts.length > 0 ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {entry.districts.slice(0, 6).map((district, districtIdx) => (
                      <div
                        key={`${entry.key}-attdistrict-${district.id}-${districtIdx}`}
                        className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-200 ring-1 ring-slate-800/40"
                      >
                        <p className="font-semibold text-slate-100">{district.name}</p>
                        <p>Hall {formatNumber(district.hallLevel)}</p>
                        <p>Destruction: {formatNumber(district.destructionPercent)}%</p>
                        <p>Attacks: {formatNumber(district.attackCount)}</p>
                        <p>Loot: {formatNumber(district.totalLooted)}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-300">Attack log is not available for this weekend.</p>
        );
      case "defense":
        return capitalDefenseEntries.length ? (
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Defense Log</h4>
            {capitalDefenseEntries.map((entry, idx) => (
              <div
                key={entry.key || `defense-${idx}`}
                className="rounded-2xl bg-slate-900/60 p-5 ring-1 ring-slate-800/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-100">{entry.attacker?.name || "Unknown Clan"}</p>
                    <p className="text-xs text-slate-400">{entry.attacker?.tag || "--"}</p>
                  </div>
                  <div className="text-right text-sm text-slate-300">
                    <p>Attacks: {formatNumber(entry.attackCount)}</p>
                    <p>
                      Districts Lost: {formatNumber(entry.districtsDestroyed)} / {formatNumber(entry.districtCount)}
                    </p>
                    <p>Perfected: {formatNumber(entry.perfectedDistricts)}</p>
                    <p>Loot Lost: {formatNumber(entry.totalLooted)}</p>
                  </div>
                </div>
                {entry.districts && entry.districts.length > 0 ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {entry.districts.slice(0, 6).map((district, districtIdx) => (
                      <div
                        key={`${entry.key}-defdistrict-${district.id}-${districtIdx}`}
                        className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-200 ring-1 ring-slate-800/40"
                      >
                        <p className="font-semibold text-slate-100">{district.name}</p>
                        <p>Hall {formatNumber(district.hallLevel)}</p>
                        <p>Destruction: {formatNumber(district.destructionPercent)}%</p>
                        <p>Enemy attacks: {formatNumber(district.attackCount)}</p>
                        <p>Loot Lost: {formatNumber(district.totalLooted)}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-300">Defense log is not available for this weekend.</p>
        );
      default:
        return null;
    }
  };

  const membersCount = useMemo(() => {
  if (Array.isArray(clan?.members)) return clan.members.length;
  if (typeof clan?.members === "number") return clan.members;
  if (typeof clan?.memberCount === "number") return clan.memberCount;
  return 0;
}, [clan]);

const donationSummary = useMemo(() => {
  if (!Array.isArray(clan?.members) || !clan.members.length) {
    return { total: 0, averageDaily: 0, bestDaily: 0, bestMember: null };
  }

  const base = clan.members.reduce(
    (acc, member) => {
      const donated = Number(member.donations ?? 0);
      const received = Number(member.received ?? member.donationsReceived ?? 0);
      const total = donated + received;
      acc.total += total;
      const daily = seasonDayCount > 0 ? total / seasonDayCount : total;
      acc.totalDaily += daily;
      if (daily > acc.bestDaily) {
        acc.bestDaily = daily;
        acc.bestMember = member;
      }
      return acc;
    },
    { total: 0, totalDaily: 0, bestDaily: 0, bestMember: null },
  );

  const averageDaily = clan.members.length ? base.totalDaily / clan.members.length : 0;

  return {
    total: base.total,
    averageDaily,
    bestDaily: base.bestDaily,
    bestMember: base.bestMember,
  };
}, [clan, seasonDayCount]);

const donationHighlightCards = useMemo(() => {
  if (!Array.isArray(clan?.members) || !clan.members.length) return [];

  const { total, averageDaily, bestDaily, bestMember } = donationSummary;
  const bestMemberName = bestMember?.name ? bestMember.name : null;
  const bestHint = bestMemberName ? `Led by ${bestMemberName}` : "Across current roster";

  return [
    {
      label: "Total donations logged",
      value: formatNumber(Math.round(total), locale),
      hint: "Includes the full member roster",
    },
    {
      label: "Average daily per clan",
      value: `${formatNumber(Math.round(averageDaily), locale)} XP`,
      hint: "Based on current member activity",
    },
    {
      label: "Best 24h streak",
      value: `${formatNumber(Math.round(bestDaily), locale)} XP`,
      hint: bestHint,
    },
  ];
}, [clan, donationSummary, locale]);

const quickStats = useMemo(
    () => [
      { label: "Members", value: `${formatNumber(membersCount)} / 50` },
      { label: "Clan Level", value: formatNumber(clan?.level) },
      { label: "War Win Streak", value: formatNumber(clan?.warWinStreak) },
      { label: "Capital Hall", value: formatNumber(clan?.clanCapital?.capitalHallLevel) },
    ],
    [clan, membersCount],
  );

  const performanceStats = useMemo(
    () => [
      { label: "Clan Points", value: formatNumber(clan?.points) },
      { label: "Builder Base Points", value: formatNumber(clan?.builderBasePoints) },
      { label: "War Wins", value: formatNumber(clan?.warWins) },
      { label: "War League", value: clan?.warLeague?.name || "--" },
    ],
    [clan],
  );

  const warSettings = useMemo(
    () => [
      { label: "Clan Type", value: prettifyText(clan?.type) },
      { label: "War Frequency", value: prettifyText(clan?.warFrequency) },
      { label: "Required Trophies", value: formatNumber(clan?.requiredTrophies) },
      { label: "War Log", value: clan?.isWarLogPublic ? "Public" : "Private" },
      { label: "Chat Language", value: clan?.chatLanguage?.name || "--" },
      { label: "Location", value: locationName },
    ],
    [clan, locationName],
  );

  const labelsList = useMemo(() => dedupeLabels(clan?.labels), [clan?.labels]);

  const copyClanTag = async () => {
    if (!clan?.tag) return;
    try {
      await navigator.clipboard.writeText(clan.tag);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(""), 2000);
    } catch (err) {
      console.error("copyClanTag", err);
      setCopyFeedback("Copy failed");
      setTimeout(() => setCopyFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-white">
        <p className="text-lg font-semibold">Loading clan profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-red-400">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!clan) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-white">
        <p className="text-lg font-semibold">Clan information is not available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#384f84] via-[#1e293b] to-[#15203a] py-12">
      <div className="mx-auto max-w-6xl px-4 space-y-10 text-white">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950/70 p-8 shadow-2xl ring-1 ring-slate-700/40">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" aria-hidden="true" />
          <div className="relative z-10 flex flex-col gap-10 xl:flex-row xl:items-start">
            <aside className="flex flex-col items-center gap-6 text-center xl:w-60 xl:text-left">
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-slate-900/80 shadow-xl ring-4 ring-slate-800/60">
                {getImageSource(badgeSources) ? (
                  <img
                    src={getImageSource(badgeSources)}
                    alt={`${clan.name} badge`}
                    className="h-28 w-28 object-contain"
                    onError={createFallbackHandler(badgeSources)}
                  />
                ) : (
                  <span className="text-sm text-slate-400">No badge</span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-wide text-slate-300 xl:justify-start">
                <span className="rounded-full bg-slate-900/70 px-3 py-1 ring-1 ring-white/10">Level {formatNumber(clan?.level)}</span>
                <span className="rounded-full bg-slate-900/70 px-3 py-1 ring-1 ring-white/10">{formatNumber(membersCount)} / 50 Members</span>
                <span className="rounded-full bg-slate-900/70 px-3 py-1 ring-1 ring-white/10">{prettifyText(clan?.type)}</span>
              </div>
            </aside>
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <div className="space-y-3">
                  <h1 className="text-4xl font-black tracking-tight">{clan.name || "Unknown Clan"}</h1>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-200/90">
                    <span className="rounded-full bg-slate-900/70 px-3 py-1 font-mono ring-1 ring-white/10">{clan.tag || "--"}</span>
                    <span className="rounded-full bg-slate-900/70 px-3 py-1 ring-1 ring-white/10">{prettifyText(clan?.warFrequency)}</span>
                    <span className="rounded-full bg-slate-900/70 px-3 py-1 ring-1 ring-white/10">{clan?.isWarLogPublic ? "War log: Public" : "War log: Private"}</span>
                    {clan?.location?.name ? (
                      <span className="rounded-full bg-slate-900/70 px-3 py-1 ring-1 ring-white/10">{clan.location.name}</span>
                    ) : null}
                  </div>
                </div>
                {clan.description ? (
                  <p className="text-sm leading-relaxed text-slate-200/90">{clan.description}</p>
                ) : null}
              </div>
              {labelsList.length ? (
                <div className="flex flex-wrap justify-center gap-3 text-xs sm:justify-start">
                  {labelsList.map((label) => {
                    const sources = buildLabelSources(label);
                    const labelSrc = getImageSource(sources);
                    return (
                      <span
                        key={label.id || label.name}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 font-medium text-slate-100 ring-1 ring-slate-800/60"
                      >
                        {labelSrc ? (
                          <img
                            src={labelSrc}
                            alt={label.name}
                            className="h-4 w-4 object-contain"
                            onError={createFallbackHandler(sources)}
                          />
                        ) : null}
                        <span>{label.name}</span>
                      </span>
                    );
                  })}
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={copyClanTag}
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
                >
                  Copy clan tag
                </button>
                {clan.tag ? (
                  <a
                    href={buildClanIngameLink(clan.tag)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-900 shadow transition hover:bg-amber-300"
                  >
                    Open in game
                  </a>
                ) : null}
                {copyFeedback ? (
                  <span className="text-xs text-emerald-300">{copyFeedback}</span>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex min-h-[110px] flex-col justify-between rounded-2xl bg-slate-900/70 p-4 ring-1 ring-slate-800/60"
                  >
                    <p className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              {donationHighlightCards.length ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {donationHighlightCards.map((card) => (
                    <div
                      key={card.label}
                      className="flex min-h-[120px] flex-col justify-between rounded-2xl bg-slate-900/70 p-4 ring-1 ring-slate-800/60"
                    >
                      <p className="text-xs uppercase tracking-wider text-slate-400">{card.label}</p>
                      <p className="mt-2 text-xl font-semibold text-white">{card.value}</p>
                      {card.hint ? (
                        <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-950/70 p-8 shadow-xl ring-1 ring-slate-700/40">
            <h2 className="text-2xl font-semibold tracking-tight">Clan Performance</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {performanceStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex min-h-[120px] flex-col justify-between rounded-2xl bg-slate-900/70 p-5 ring-1 ring-slate-800/60"
                >
                  <p className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-slate-950/70 p-8 shadow-xl ring-1 ring-slate-700/40">
            <h2 className="text-2xl font-semibold tracking-tight">Requirements & Settings</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {warSettings.map((stat) => (
                <div
                  key={stat.label}
                  className="flex min-h-[120px] flex-col justify-between rounded-2xl bg-slate-900/70 p-5 ring-1 ring-slate-800/60"
                >
                  <p className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {warNarrative ? (
          <section className="rounded-3xl bg-gradient-to-br from-slate-950/80 via-slate-900/80 to-slate-950/80 p-8 text-white shadow-xl ring-1 ring-slate-700/40">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold tracking-tight">War Room Insights</h3>
                <p className="text-sm text-slate-300">{warNarrative.headline}</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  {warNarrative.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl bg-slate-900/70 p-5 text-sm text-slate-200 ring-1 ring-slate-800/50">
                <p className="text-base font-semibold text-white">Rally your clan</p>
                <p>
                  Celebrate the story behind the stats with a quick share or invite -- a nod to the narrative moments featured on Top Req Clans.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={warShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 font-semibold text-slate-900 transition hover:bg-sky-400"
                  >
                    Share on X
                  </a>
                  <a
                    href={buildClanIngameLink(clan.tag)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-slate-600 px-4 py-2 font-semibold text-slate-100 transition hover:border-amber-400 hover:text-amber-300"
                  >
                    View in game
                  </a>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl bg-slate-950/70 p-8 text-white shadow-xl ring-1 ring-slate-700/40">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">Clan Capital Raids</h3>
              {latestCapitalSeason ? (
                <p className="text-sm text-slate-300">
                  {latestCapitalSeason.state === "ongoing" ? "Current weekend" : "Latest weekend"} - {formatDateTime(latestCapitalSeason.startTime)} to {formatDateTime(latestCapitalSeason.endTime)}
                </p>
              ) : null}
            </div>
            {capitalLoading ? <span className="text-sm text-slate-400">Loading...</span> : null}
          </div>
          {capitalLoading ? (
            <div className="flex justify-center py-6">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-400 border-t-transparent"></div>
            </div>
          ) : capitalError ? (
            <p className="text-sm text-red-400">{capitalError}</p>
          ) : !latestCapitalSeason ? (
            <p className="text-sm text-slate-300">Capital raid history is not available.</p>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Clan capital sections">
                {CAPITAL_TAB_ITEMS.map((tab) => {
                  const isActive = capitalActiveTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      id={`capital-tab-trigger-${tab.id}`}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`capital-tab-${tab.id}`}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                        isActive ? "bg-sky-500 text-slate-950 shadow-sm" : "bg-slate-900/60 text-slate-300 hover:text-white"
                      }`}
                      onClick={() => setCapitalActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div
                role="tabpanel"
                id={`capital-tab-${capitalActiveTab}`}
                aria-labelledby={`capital-tab-trigger-${capitalActiveTab}`}
              >
                {renderCapitalTabContent()}
              </div>
            </div>
          )}
        </section>



        <section className="rounded-3xl bg-slate-950/70 p-8 text-white shadow-xl ring-1 ring-slate-700/40">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold tracking-tight">Clan Name History</h3>
            {nameHistoryLoading ? (
              <span className="text-sm text-slate-400">Loading...</span>
            ) : null}
          </div>

          {nameHistoryError ? (
            <div className="rounded-2xl bg-slate-900/70 p-6 text-sm text-red-300 ring-1 ring-red-500/40">
              {nameHistoryError}
            </div>
          ) : nameHistoryLoading && nameHistoryEntries.length === 0 ? (
            <div className="flex min-h-[120px] items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
              <span className="sr-only">Loading clan name history</span>
            </div>
          ) : nameHistoryEntries.length > 0 ? (
            <ul className="space-y-3">
              {nameHistoryEntries.map((entry) => {
                const fromLabel = entry.from || "Unknown";
                const toLabel = entry.to || "Unknown";
                const tooltip = `Changed clan name from ${fromLabel} to ${toLabel}`;

                return (
                  <li key={`${entry.timestamp}|${entry.from}|${entry.to}`}>
                    <div
                      className="grid gap-2 rounded-2xl bg-slate-900/70 px-5 py-4 ring-1 ring-slate-800/60 sm:grid-cols-[auto,1fr] sm:items-center"
                      title={tooltip}
                    >
                      <span className="text-lg font-semibold text-white">{entry.timestamp}</span>
                      <div className="text-sm text-slate-300">
                        <span className="font-medium text-slate-100">Changed clan name</span>
                        <div className="mt-1">
                          <span>from </span>
                          <span className="font-semibold text-amber-300">{fromLabel}</span>
                          <span> to </span>
                          <span className="font-semibold text-emerald-300">{toLabel}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-slate-300">No clan name changes have been recorded yet.</p>
          )}
        </section>

        <section className="rounded-3xl bg-slate-950/70 p-8 text-white shadow-xl ring-1 ring-slate-700/40">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold tracking-tight">Clan Members</h3>
            <p className="text-sm text-slate-300">Total members: {formatNumber(membersCount)}</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr className="text-left text-xs uppercase tracking-wide">
                  <th className="px-4 py-3">League</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Tag</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Trophies</th>
                  <th className="px-4 py-3">Donations</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Total (Season)</th>
                  <th className="px-4 py-3">Daily Donations</th>
                  <th className="px-4 py-3">Town Hall</th>
                </tr>
              </thead>
              <tbody className="bg-slate-950/60">
                {Array.isArray(clan.members) && clan.members.length > 0 ? (
                  clan.members.map((player, idx) => {
                    const sources = buildLeagueSources(player.league);
                    const leagueSrc = getImageSource(sources);
                    const donationsGiven = Number(player.donations ?? 0);
                    const donationsReceived = Number(
                      player.received ?? player.donationsReceived ?? 0
                    );
                    const totalDonations = donationsGiven + donationsReceived;
                    const dailyAverage = Math.round(totalDonations / seasonDayCount);
                    return (
                      <tr
                        key={player.tag}
                        className={`text-sm transition hover:bg-slate-900 ${idx % 2 === 0 ? "bg-slate-950/40" : "bg-slate-900/40"}`}
                      >
                        <td className="px-4 py-3">
                          <Link to={`/player/${player.tag.replace("#", "")}`}>
                            {leagueSrc ? (
                              <img
                                src={leagueSrc}
                                alt={player.league?.name || "League"}
                                className="h-10 w-10 object-contain"
                                onError={createFallbackHandler(sources)}
                              />
                            ) : (
                              <span className="text-slate-500">--</span>
                            )}
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          <Link to={`/player/${player.tag.replace("#", "")}`}>{player.name}</Link>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{player.tag}</td>
                        <td className="px-4 py-3 text-slate-300">{formatNumber(player.expLevel)}</td>
                        <td className="px-4 py-3 capitalize text-slate-200">{player.role || "member"}</td>
                        <td className="px-4 py-3 text-slate-300">{formatNumber(player.trophies)}</td>
                        <td className="px-4 py-3 text-slate-300">
                          {formatNumber(donationsGiven)}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {formatNumber(donationsReceived)}
                        </td>
                        <td className="px-4 py-3 text-emerald-300 font-semibold">
                          {formatNumber(totalDonations)}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {formatNumber(dailyAverage)}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {player.townHallLevel ? (
                            <div className="relative inline-flex h-10 w-10 items-center justify-center">
                              <img
                                src={getTownHallImage(player.townHallLevel)}
                                alt={`Town Hall ${player.townHallLevel}`}
                                className="h-10 w-10 object-contain"
                                onError={hideImgOnError}
                              />
                              <span className="absolute bottom-0 right-0 rounded-full bg-slate-900/80 px-2 text-xs font-semibold text-white">
                                {formatNumber(player.townHallLevel)}
                              </span>
                            </div>
                          ) : (
                            <span>{formatNumber(player.townHallLevel)}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-400" colSpan={11}>
                      No members to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClanDetails;
