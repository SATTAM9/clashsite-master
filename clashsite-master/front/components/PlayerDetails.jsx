import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerCollections from "./ui/TapPlayer";
import PlayerHistorySection from "./player/PlayerHistorySection";
import SeasonTrophiesChart from "./analytics/SeasonTrophiesChart";
import TroopProgressChart from "./analytics/TroopProgressChart";
import { ASSET_BASE_URL, LOCAL_ICON_BASE, buildLabelSources, buildLocalFromRemote, createFallbackHandler, dedupeLabels, getImageSource, pickIconUrl } from "../lib/cocAssets";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const UNRANKED_LEAGUE = {
  id: 29000000,
  name: "Unranked",
  iconUrls: {
    small: "https://api-assets.clashofclans.com/leagues/72/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png",
    tiny: "https://api-assets.clashofclans.com/leagues/36/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png",
  },
};

const NAV_SECTIONS = [
  { id: "details", label: "Details" },
  { id: "history", label: "History" },
  { id: "troops", label: "Troops" },
  { id: "spells", label: "Spells" },
  { id: "heroes", label: "Heroes" },
  { id: "equipment", label: "Equipment" },
  { id: "achievements", label: "Achievements" },
];

const getTownHallImage = (level) => {
  if (!level) return "";
  return `${LOCAL_ICON_BASE}/town-hall-pics/town-hall-${level}.png`;
};

const getBuilderHallImage = (level) => {
  if (!level) return "";
  return `${LOCAL_ICON_BASE}/builder-hall-pics/Building_BB_Builder_Hall_level_${level}.png`;
};

const hideImgOnError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.style.visibility = "hidden";
};

const formatNumber = (value) => {
  if (value === null || value === undefined) return "--";
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toLocaleString() : value;
};

const buildBadgeSources = (badge) => {
  if (!badge) return { local: "", remote: "" };
  const remote = badge.large || badge.medium || badge.small || badge.url || "";
  const local = buildLocalFromRemote(remote);
  return { local, remote };
};

const buildLeagueSources = (league) => {
  const data = league && league.id ? league : UNRANKED_LEAGUE;
  const remote =
    pickIconUrl(data?.iconUrls) ||
    data?.icon?.medium ||
    data?.icon?.small ||
    data?.icon?.url ||
    (data?.id ? `${ASSET_BASE_URL}/leagues/${data.id}.png` : "");
  // League icons provided by the API are already the authoritative assets.
  // Local league sprites are often out-of-date or have hashed filenames, so we skip them here.
  return { local: "", remote };
};

const buildPlayerIngameLink = (tag) => {
  if (!tag) return "";
  const normalized = tag.startsWith('#') ? tag : `#${tag}`;
  return `https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${encodeURIComponent(normalized)}`;
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

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

const HISTORY_TIMESTAMP_PATTERN = /(\d{4}-\d{2}-\d{2}|\d{2}[./]\d{2}[./]\d{4})(?:\s+|T)?(\d{2}:\d{2}(?::\d{2})?)?/;

const formatHistoryTimestamp = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  const normalized = String(value).replace(/\\s+/g, " " ).trim();
  if (!normalized) {
    return "";
  }
  const looksIsoLike = /\\d{4}-\\d{2}-\\d{2}/.test(normalized) || /\\d{2}[./]\\d{2}[./]\\d{4}/.test(normalized);
  if (looksIsoLike) {
    return normalized;
  }
  const parsed = new Date(normalized);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleString();
  }
  const fallback = normalized.match(HISTORY_TIMESTAMP_PATTERN);
  if (fallback) {
    const [, datePart, timePart] = fallback;
    return [datePart, timePart || ""].filter(Boolean).join(" " );
  }
  return normalized;
};

const cleanHistoryName = (value) => {
  if (!value) {
    return "";
  }
  return String(value).replace(/\s+/g, " " ).trim().replace(/^"|"$/g, "");
};

const parseNamesFromHistoryText = (text) => {
  if (!text) {
    return { from: "", to: "" };
  }
  const matchFromTo = text.match(/changed(?: their)? name from\s+"?([^"']+?)"?\s+to\s+"?([^"']+?)"?/i);
  if (matchFromTo) {
    return { from: cleanHistoryName(matchFromTo[1]), to: cleanHistoryName(matchFromTo[2]) };
  }
  const matchToFrom = text.match(/changed(?: their)? name to\s+"?([^"']+?)"?\s+from\s+"?([^"']+?)"?/i);
  if (matchToFrom) {
    return { from: cleanHistoryName(matchToFrom[2]), to: cleanHistoryName(matchToFrom[1]) };
  }
  const matchToOnly = text.match(/changed(?: their)? name to\s+"?([^"']+?)"?/i);
  if (matchToOnly) {
    return { from: "", to: cleanHistoryName(matchToOnly[1]) };
  }
  const matchFromOnly = text.match(/changed(?: their)? name from\s+"?([^"']+?)"?/i);
  if (matchFromOnly) {
    return { from: cleanHistoryName(matchFromOnly[1]), to: "" };
  }
  return { from: "", to: "" };
};

const buildPlayerNameChangeEntries = (rawNameChanges, trackedActions) => {
  const entries = [];
  const seen = new Set();

  const pushEntry = (timestamp, from, to, sourceKey) => {
    const formattedTimestamp = formatHistoryTimestamp(timestamp);
    const label = formattedTimestamp || "Timestamp unavailable";
    const fromLabel = cleanHistoryName(from);
    const toLabel = cleanHistoryName(to);
    if (!label && !fromLabel && !toLabel) {
      return;
    }
    const dedupeKey = [label, fromLabel, toLabel, sourceKey || ""].join("|");
    if (seen.has(dedupeKey)) {
      return;
    }
    entries.push({ timestamp: label, from: fromLabel, to: toLabel });
    seen.add(dedupeKey);
  };

  if (Array.isArray(rawNameChanges)) {
    rawNameChanges.forEach((change, index) => {
      if (change === null || change === undefined) {
        return;
      }
      if (typeof change === "string") {
        pushEntry(change, "", "", "raw:" + index);
        return;
      }
      if (typeof change !== "object") {
        return;
      }
      const timestampSource =
        change.timestamp || change.time || change.date || change.when || change.raw || change.value || "";
      let fromName = change.from || change.previous || change.old || "";
      let toName = change.to || change.current || change.new || "";

      if (!fromName && !toName) {
        const parsed = parseNamesFromHistoryText(change.action || change.description || change.detail || "");
        fromName = parsed.from;
        toName = parsed.to;
      }

      pushEntry(timestampSource, fromName, toName, "raw:" + index);
    });
  }

  if (!entries.length && Array.isArray(trackedActions)) {
    trackedActions.forEach((item, index) => {
      if (!item || typeof item !== "object") {
        return;
      }
      const actionText = typeof item.action === "string" ? item.action : "";
      if (!actionText || !actionText.toLowerCase().includes("changed name")) {
        return;
      }
      const parsed = parseNamesFromHistoryText(actionText);
      const timestampSource = item.timestamp || actionText;
      pushEntry(timestampSource, parsed.from, parsed.to, "tracked:" + index);
    });
  }

  return entries;
};

const PlayerDetails = () => {
  const { tag } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("details");
  const [capitalOverview, setCapitalOverview] = useState(null);
  const [capitalLoading, setCapitalLoading] = useState(false);
  const [capitalError, setCapitalError] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const copyTimeoutRef = useRef(null);
  const [clanLabels, setClanLabels] = useState([]);
  const [clanLabelsLoading, setClanLabelsLoading] = useState(false);
  const [clanLabelsError, setClanLabelsError] = useState("");

  const [historyState, setHistoryState] = useState({
    nameChanges: [],
    hasNameChange: false,
    fetchedTag: "",
  });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

useEffect(() => {
  if (!player?.clan?.tag) {
    setCapitalOverview(null);
    return;
  }

  let isCancelled = false;
  const controller = new AbortController();

  const fetchCapitalRaid = async () => {
    setCapitalLoading(true);
    setCapitalError("");

    const normalizedTag = player.clan.tag.replace(/^#/, "");

    try {
      const response = await fetch(
        `${API_BASE_URL}/clans/${encodeURIComponent(normalizedTag)}/capitalraid?limit=1`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      if (isCancelled) {
        return;
      }

      if (payload.success && Array.isArray(payload.seasons) && payload.seasons.length > 0) {
        const season = payload.seasons[0];
        const members = Array.isArray(season.members) ? season.members : [];
        const normalizedPlayerTag = player.tag ? player.tag.replace(/^#/, "").toUpperCase() : "";
        const memberEntry =
          members.find(
            (member) => member.tag && member.tag.replace(/^#/, "").toUpperCase() === normalizedPlayerTag
          ) || null;

        setCapitalOverview({
          season,
          member: memberEntry,
        });
      } else {
        setCapitalOverview(null);
        setCapitalError(payload.error || "Unable to load capital raid data.");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }
      if (!isCancelled) {
        console.error("player capital raid fetch", err);
        setCapitalOverview(null);
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
}, [player?.clan?.tag, player?.tag]);

  useEffect(() => {
    const clanTag = player?.clan?.tag;

    if (!clanTag) {
      setClanLabels([]);
      setClanLabelsError("");
      setClanLabelsLoading(false);
      return;
    }

    if (Array.isArray(player?.clan?.labels) && player.clan.labels.length) {
      setClanLabels(dedupeLabels(player.clan.labels));
      setClanLabelsError("");
      setClanLabelsLoading(false);
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();
    setClanLabelsLoading(true);
    setClanLabelsError("");

    const normalizedTag = clanTag.startsWith("#") ? clanTag : `#${clanTag}`;

    const fetchClanLabels = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/clanbytagForDetails`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag: normalizedTag }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }

        const payload = await response.json();
        if (isCancelled) {
          return;
        }

        if (payload.success && Array.isArray(payload.clanInfo?.labels)) {
          setClanLabels(dedupeLabels(payload.clanInfo.labels));
          setClanLabelsError("");
        } else {
          setClanLabels([]);
          if (payload.error) {
            setClanLabelsError(payload.error);
          }
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        if (!isCancelled) {
          console.error("clan labels fetch", err);
          setClanLabels([]);
          setClanLabelsError("Unable to load clan labels.");
        }
      } finally {
        if (!isCancelled) {
          setClanLabelsLoading(false);
        }
      }
    };

    fetchClanLabels();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [player?.clan?.tag, player?.clan?.labels]);

  const seasonDayCount = useMemo(() => getSeasonDayCount(), []);
  const donationStats = useMemo(() => {
    const donations = Number(player?.donations ?? 0);
    const received = Number(
      player?.donationsReceived ?? player?.received ?? 0
    );
    const total = donations + received;
    const dailyAverage = Math.round(total / seasonDayCount);
    return {
      donations,
      received,
      total,
      dailyAverage,
    };
  }, [player, seasonDayCount]);

  const {
    nameChanges: historyNameChanges,
    hasNameChange: historyHasNameChange,
  } = historyState;

  useEffect(() => {
    const controller = new AbortController();
    const fetchPlayer = async () => {
      setLoading(true);
      setError("");

      const normalizedTag = !tag ? "" : tag.startsWith("#") ? tag : `#${tag}`;
      if (!normalizedTag) {
        setError("Player tag is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/playerbytag`, {
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
          setPlayer(payload.playerInfo ?? null);
        } else {
          throw new Error(payload.error || "Unable to load player details.");
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        console.error("playerbytag", err);
        setPlayer(null);
        setError("Unable to fetch the player profile right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
    return () => {
      controller.abort();
    };
  }, [tag]);

  useEffect(() => {
    setHistoryState({
      nameChanges: [],
      hasNameChange: false,
      fetchedTag: "",
    });
    setHistoryError("");
    setHistoryLoading(false);
  }, [tag]);

  useEffect(() => {
    if (activeSection !== "history") {
      return;
    }

    const normalizedTag = !tag ? "" : tag.startsWith("#") ? tag.slice(1) : tag;
    if (!normalizedTag) {
      setHistoryError("Player tag is missing.");
      setHistoryState({
        nameChanges: [],
        hasNameChange: false,
        fetchedTag: "",
      });
      return;
    }

    if (historyState.fetchedTag === normalizedTag) {
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();

    const loadHistory = async () => {
      setHistoryLoading(true);
      setHistoryError("");

      try {
        const response = await fetch(`${API_BASE_URL}/players/${encodeURIComponent(normalizedTag)}/history`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }

        const payload = await response.json();
        if (isCancelled) {
          return;
        }

        if (payload.success) {
          const computedNameChanges = buildPlayerNameChangeEntries(payload.nameChanges, payload.trackedActions);
          const detectedNameChange = computedNameChanges.length > 0 || Boolean(payload.hasNameChange);
          setHistoryState({
            nameChanges: computedNameChanges,
            hasNameChange: detectedNameChange,
            fetchedTag: normalizedTag,
          });
          setHistoryError("");
        } else {
          const computedNameChanges = buildPlayerNameChangeEntries(payload.nameChanges, payload.trackedActions);
          const detectedNameChange = computedNameChanges.length > 0 || Boolean(payload.hasNameChange);
          setHistoryState({
            nameChanges: computedNameChanges,
            hasNameChange: detectedNameChange,
            fetchedTag: normalizedTag,
          });
          setHistoryError(payload.error || "Unable to load history.");
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        console.error("player history fetch", err);
        if (!isCancelled) {
          setHistoryState({
            nameChanges: [],
            hasNameChange: false,
            fetchedTag: normalizedTag,
          });
          setHistoryError("Unable to load history at the moment.");
        }
      } finally {
        if (!isCancelled) {
          setHistoryLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [activeSection, tag, historyState.fetchedTag]);

  const handleHistoryRetry = () => {
    setHistoryError("");
    setHistoryState({
      nameChanges: [],
      hasNameChange: false,
      fetchedTag: "",
    });
  };

  const leagueSources = useMemo(() => buildLeagueSources(player?.league), [player]);
  const clanBadgeSources = useMemo(() => buildBadgeSources(player?.clan?.badge), [player]);
  const labels = useMemo(() => dedupeLabels(player?.labels), [player?.labels]);
  const legendStats = player?.legendStatistics;
  const leagueName = player?.league?.name || UNRANKED_LEAGUE.name;

  const highlightStats = useMemo(() => {
    const stats = [
      { label: "Legend Trophies", value: formatNumber(player?.legendStatistics?.legendTrophies) },
      { label: "Trophies", value: formatNumber(player?.trophies) },
      { label: "Best Trophies", value: formatNumber(player?.bestTrophies) },
      { label: "War Stars", value: formatNumber(player?.warStars) },
      { label: "Attack Wins", value: formatNumber(player?.attackWins) },
      { label: "Defense Wins", value: formatNumber(player?.defenseWins) },
      {
        label: "Donations Given",
        value: formatNumber(donationStats.donations),
      },
      {
        label: "Donations Received",
        value: formatNumber(donationStats.received),
      },
      {
        label: "Total Donations (Season)",
        value: formatNumber(donationStats.total),
      },
      {
        label: "Daily Donations",
        value: formatNumber(donationStats.dailyAverage),
      },
      { label: "Builder Trophies", value: formatNumber(player?.builderBaseTrophies) },
      { label: "Best Builder Trophies", value: formatNumber(player?.bestBuilderBaseTrophies) },
      { label: "Clan Capital Contributions", value: formatNumber(player?.clanCapitalContributions) },
    ];

    if (capitalOverview?.member) {
      stats.push(
        {
          label: "Capital Attacks (latest)",
          value: formatNumber(capitalOverview.member.attacks),
        },
        {
          label: "Capital Looted (latest)",
          value: formatNumber(capitalOverview.member.capitalResourcesLooted),
        }
      );
    }

    return stats;
  }, [player, donationStats, capitalOverview]);

  const heroStats = useMemo(() => highlightStats.slice(0, 6), [highlightStats]);
  const additionalStats = useMemo(() => highlightStats.slice(6), [highlightStats]);
  const latestCapitalSeason = capitalOverview?.season ?? null;

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

  const trophyTrendPoints = useMemo(() => {
    if (!legendStats) return [];

    let fallbackCounter = 0;

    const createBucket = (id, labelOverride) => {
      let label = labelOverride;
      let sortKey = null;

      if (typeof id === "string") {
        const [yearStr, monthStr] = id.split("-");
        const year = Number(yearStr);
        const month = Number(monthStr) - 1;
        if (
          Number.isFinite(year) &&
          Number.isFinite(month) &&
          month >= 0 &&
          month < 12
        ) {
          const date = new Date(Date.UTC(year, month, 1));
          label =
            label || date.toLocaleString(undefined, { month: "short", year: "numeric" });
          sortKey = date.getTime();
        }
      }

      if (sortKey === null) {
        fallbackCounter += 1;
        sortKey = 10_000_000 + fallbackCounter;
        label = label || (typeof id === "string" ? id : `Season ${fallbackCounter}`);
      }

      return {
        label,
        sortKey,
        legend: null,
        builder: null,
      };
    };

    const map = new Map();

    const getBucket = (id, labelOverride) => {
      const key = id || labelOverride || `season-${map.size + 1}`;
      if (!map.has(key)) {
        map.set(key, createBucket(id, labelOverride));
      }
      return map.get(key);
    };

    const addLegend = (season) => {
      if (!season || typeof season.trophies !== "number") return;
      const bucket = getBucket(season.id);
      bucket.legend =
        bucket.legend === null ? season.trophies : Math.max(bucket.legend, season.trophies);
    };

    const addBuilder = (season) => {
      if (!season || typeof season.trophies !== "number") return;
      const bucket = getBucket(season.id);
      bucket.builder =
        bucket.builder === null ? season.trophies : Math.max(bucket.builder, season.trophies);
    };

    addLegend(legendStats.currentSeason);
    addLegend(legendStats.previousSeason);
    addLegend(legendStats.bestSeason);
    addBuilder(legendStats.previousVersusSeason);
    addBuilder(legendStats.bestVersusSeason);
    addBuilder(legendStats.previousBuilderBaseSeason);
    addBuilder(legendStats.bestBuilderBaseSeason);

    if (
      typeof legendStats.legendTrophies === "number" &&
      (!legendStats.currentSeason || typeof legendStats.currentSeason.trophies !== "number")
    ) {
      const bucket = getBucket("current", "Current");
      bucket.legend = legendStats.legendTrophies;
    }

    return Array.from(map.values())
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ label, legend, builder }) => ({
        label,
        legend: typeof legend === "number" ? legend : null,
        builder: typeof builder === "number" ? builder : null,
      }));
  }, [legendStats]);

  const troopProgressData = useMemo(() => {
    const troops = Array.isArray(player?.troops)
      ? player.troops.filter((troop) =>
          troop.village === "home" &&
          typeof troop.level === "number" &&
          typeof troop.maxLevel === "number" &&
          troop.maxLevel > 0,
        )
      : [];

    const normalized = troops
      .map((troop) => ({
        name: troop.name,
        percent: Math.min(100, Math.round((troop.level / troop.maxLevel) * 100)),
      }))
      .filter((item) => Number.isFinite(item.percent));

    normalized.sort((a, b) => b.percent - a.percent);

    return normalized.slice(0, 8);
  }, [player]);

  const copyPlayerTag = async () => {
    if (!player?.tag) return;
    try {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      await navigator.clipboard.writeText(player.tag);
      setCopyFeedback("Copied!");
    } catch (err) {
      console.error("copyPlayerTag", err);
      setCopyFeedback("Copy failed");
    }
    copyTimeoutRef.current = window.setTimeout(() => setCopyFeedback(""), 2000);
  };

  const renderCapitalCard = () => {
    if (capitalLoading) {
      return (
        <div className="rounded-2xl bg-slate-900/60 p-6 text-sm text-slate-300 ring-1 ring-slate-800/40">
          Loading capital raid data...
        </div>
      );
    }

    if (capitalError) {
      return (
        <div className="rounded-2xl bg-slate-900/60 p-6 text-sm text-red-300 ring-1 ring-slate-800/40">
          {capitalError}
        </div>
      );
    }

    if (!latestCapitalSeason) {
      return null;
    }

    const timeframe = `${formatDateTime(latestCapitalSeason.startTime)} to ${formatDateTime(latestCapitalSeason.endTime)}`;
    const memberStats = capitalOverview?.member;

    return (
      <div className="rounded-2xl bg-gradient-to-br from-emerald-900/50 via-slate-900/80 to-slate-900/80 p-6 ring-1 ring-emerald-500/30">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">Capital Raid</h3>
          {capitalLoading ? <span className="text-xs text-slate-200">Updating...</span> : null}
        </div>
        <p className="mt-1 text-xs text-slate-300">{timeframe}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {capitalSummaryStats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-slate-950/40 p-3">
              <p className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</p>
              <p className="mt-1 text-lg font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
        {memberStats ? (
          <div className="mt-4 rounded-xl bg-slate-950/40 p-4 text-sm text-slate-200">
            <p className="mb-3 text-xs uppercase tracking-wider text-slate-400">Your contribution</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex justify-between">
                <span>Attacks used</span>
                <span>
                  {formatNumber(memberStats.attacks)} / {formatNumber(memberStats.attackLimit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Bonus attacks</span>
                <span>{formatNumber(memberStats.bonusAttackLimit)}</span>
              </div>
              <div className="flex justify-between">
                <span>Loot collected</span>
                <span>{formatNumber(memberStats.capitalResourcesLooted)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-xs text-slate-300">No participation recorded for the latest raid.</p>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (activeSection === "details") return;
    if (activeSection !== "details" && !player) {
      setActiveSection("details");
    }
  }, [activeSection, player]);

  useEffect(() => () => {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-white">
        <p className="text-lg font-semibold">Loading player profile...</p>
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

  if (!player) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-white">
        <p className="text-lg font-semibold">Player data is not available.</p>
      </div>
    );
  }

  const capitalCard = renderCapitalCard();

  const builderCard = (
    <div className="rounded-2xl bg-gradient-to-br from-blue-900/50 via-slate-900/80 to-slate-900/80 p-6 ring-1 ring-blue-500/30">
      <h3 className="text-lg font-semibold">Builder Base</h3>
      {player.builderHallLevel ? (
        <div className="mt-3 flex justify-center">
          <img
            src={getBuilderHallImage(player.builderHallLevel)}
            alt={`Builder Hall ${player.builderHallLevel}`}
            className="h-16 w-16 object-contain"
            onError={hideImgOnError}
          />
        </div>
      ) : null}
      <dl className="mt-4 space-y-2 text-sm text-slate-200">
        <div className="flex justify-between">
          <dt>Builder Hall</dt>
          <dd>{formatNumber(player.builderHallLevel)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Builder League</dt>
          <dd>{player.builderBaseLeague?.name || "--"}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Night trophies</dt>
          <dd>{formatNumber(player.builderBaseTrophies)}</dd>
        </div>
        {legendStats?.bestBuilderBaseSeason ? (
          <div className="flex justify-between">
            <dt>Best BB season trophies</dt>
            <dd>{formatNumber(legendStats.bestBuilderBaseSeason.trophies)}</dd>
          </div>
        ) : null}
        {legendStats?.bestBuilderBaseSeason?.rank ? (
          <div className="flex justify-between">
            <dt>Best BB season rank</dt>
            <dd>{`#${legendStats.bestBuilderBaseSeason.rank}`}</dd>
          </div>
        ) : null}
        {legendStats?.previousBuilderBaseSeason ? (
          <div className="flex justify-between">
            <dt>Previous BB season trophies</dt>
            <dd>{formatNumber(legendStats.previousBuilderBaseSeason.trophies)}</dd>
          </div>
        ) : null}
        {legendStats?.previousBuilderBaseSeason?.rank ? (
          <div className="flex justify-between">
            <dt>Previous BB season rank</dt>
            <dd>{`#${legendStats.previousBuilderBaseSeason.rank}`}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#384f84] via-[#1e293b] to-[#0f172a] py-12">
      <div className="mx-auto max-w-6xl px-4 space-y-10 text-white">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950/75 p-8 shadow-2xl ring-1 ring-slate-700/40">
          <div className="absolute -top-28 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-32 right-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden="true" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,2fr),minmax(0,1.15fr)]">
            <div className="space-y-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="flex justify-center lg:justify-start">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-900/80 shadow-xl ring-4 ring-slate-800/60">
                    {getImageSource(leagueSources) ? (
                      <img
                        src={getImageSource(leagueSources)}
                        alt={player?.league?.name || "League"}
                        className="h-20 w-20 object-contain"
                        onError={createFallbackHandler(leagueSources)}
                      />
                    ) : (
                      <span className="text-sm text-slate-400">{leagueName}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-4 text-center lg:text-left">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{player?.name || "Unknown Player"}</h1>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-300 lg:justify-start">
                      <span className="rounded-full bg-slate-900/70 px-3 py-1 ring-1 ring-white/10">{player?.tag}</span>
                      <span className="rounded-full bg-slate-900/70 px-3 py-1 ring-1 ring-white/10">Town Hall {formatNumber(player.townHallLevel)}</span>
                      <span className="rounded-full bg-slate-900/70 px-3 py-1 ring-1 ring-white/10">{leagueName}</span>
                    </div>
                  </div>
                  {labels.length ? (
                    <div className="flex flex-wrap justify-center gap-2 text-xs lg:justify-start">
                      {labels.map((label) => {
                        const sources = buildLabelSources(label);
                        const labelSrc = getImageSource(sources);
                        return (
                          <span
                            key={label.id}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 ring-1 ring-slate-700/60"
                          >
                            {labelSrc ? (
                              <img
                                src={labelSrc}
                                alt={label.name}
                                className="h-4 w-4 object-contain"
                                onError={createFallbackHandler(sources)}
                              />
                            ) : null}
                            {label.name}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                  <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                    <button
                      type="button"
                      onClick={copyPlayerTag}
                      className="inline-flex items-center justify-center rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Copy player tag
                    </button>
                    {player?.tag ? (
                      <a
                        href={buildPlayerIngameLink(player.tag)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:bg-amber-300"
                      >
                        Open in game
                      </a>
                    ) : null}
                    {copyFeedback ? (
                      <span className="text-xs text-emerald-300" aria-live="polite">{copyFeedback}</span>
                    ) : null}
                  </div>
                </div>
              </div>
              {heroStats.length ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-slate-800/50 transition hover:-translate-y-1 hover:ring-amber-400/60"
                    >
                      <p className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {player?.clan ? (
                <div className="rounded-2xl bg-slate-900/70 p-5 ring-1 ring-slate-800/60">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Clan</p>
                  <div className="mt-3 flex items-center gap-3">
                    {getImageSource(clanBadgeSources) ? (
                      <img
                        src={getImageSource(clanBadgeSources)}
                        alt={`${player.clan.name} badge`}
                        className="h-14 w-14 rounded-full border border-amber-400/50 object-contain"
                        onError={createFallbackHandler(clanBadgeSources)}
                      />
                    ) : null}
                    <div>
                      <p className="text-lg font-semibold text-white">{player.clan.name}</p>
                      <p className="text-xs font-mono text-slate-400">{player.clan.tag}</p>
                      <p className="text-xs text-slate-300">Role: {player.role || "Member"}</p>
                    </div>
                  </div>
                  {clanLabelsLoading ? (
                    <p className="mt-3 text-xs text-slate-400">Loading clan labels...</p>
                  ) : clanLabelsError ? (
                    <p className="mt-3 text-xs text-slate-400">{clanLabelsError}</p>
                  ) : clanLabels.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {clanLabels.map((label) => {
                        const sources = buildLabelSources(label);
                        const labelSrc = getImageSource(sources);
                        return (
                          <span
                            key={label.id || label.name}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-medium ring-1 ring-slate-700/60"
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
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-900/40 p-5 ring-1 ring-slate-800/40 text-sm text-slate-300">
                  This player is not currently in a clan.
                </div>
              )}
              <div className="rounded-2xl bg-slate-900/70 p-5 text-center ring-1 ring-slate-800/60">
                <p className="text-xs uppercase tracking-wider text-slate-400">Town Hall</p>
                {player.townHallLevel ? (
                  <div className="mb-3 mt-2 flex justify-center">
                    <img
                      src={getTownHallImage(player.townHallLevel)}
                      alt={`Town Hall ${player.townHallLevel}`}
                      className="h-16 w-16 object-contain"
                      onError={hideImgOnError}
                    />
                  </div>
                ) : null}
                <p className="text-3xl font-bold text-white">{formatNumber(player.townHallLevel)}</p>
                {player.townHallWeaponLevel ? (
                  <p className="text-xs text-slate-300">Weapon level {player.townHallWeaponLevel}</p>
                ) : null}
              </div>
              {player.builderHallLevel ? (
                <div className="rounded-2xl bg-slate-900/70 p-5 text-center ring-1 ring-slate-800/60">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Builder Hall</p>
                  <div className="mb-3 mt-2 flex justify-center">
                    <img
                      src={getBuilderHallImage(player.builderHallLevel)}
                      alt={`Builder Hall ${player.builderHallLevel}`}
                      className="h-16 w-16 object-contain"
                      onError={hideImgOnError}
                    />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatNumber(player.builderHallLevel)}</p>
                  {player.builderBaseLeague?.name ? (
                    <p className="text-xs text-slate-300">{player.builderBaseLeague.name}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <nav className="sticky top-6 z-10">
          <div className="flex overflow-x-auto gap-2 rounded-full border border-white/10 bg-slate-900/70 p-1 text-sm backdrop-blur">
            {NAV_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 font-semibold transition ${
                  activeSection === section.id
                    ? "bg-amber-400 text-slate-900 shadow"
                    : "bg-slate-900/40 text-slate-200 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        {activeSection === "details" ? (
          <section className="space-y-10 rounded-3xl bg-slate-950/70 p-8 text-white shadow-xl ring-1 ring-slate-700/40">
            {additionalStats.length ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold tracking-tight text-slate-100">Additional player stats</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {additionalStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-slate-800/40"
                    >
                      <p className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</p>
                      <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {(trophyTrendPoints.length || troopProgressData.length) ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {trophyTrendPoints.length ? (
                  <SeasonTrophiesChart points={trophyTrendPoints} />
                ) : null}
                {troopProgressData.length ? (
                  <TroopProgressChart data={troopProgressData} />
                ) : null}
              </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-3">
              {legendStats ? (
                <div className="rounded-2xl bg-gradient-to-br from-purple-900/60 via-slate-900/80 to-slate-900/80 p-6 ring-1 ring-purple-500/30 lg:col-span-2">
                  <h3 className="text-lg font-semibold">Legend League</h3>
                  <dl className="mt-4 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
                    <div className="flex justify-between">
                      <dt>Total legend trophies</dt>
                      <dd>{formatNumber(legendStats.legendTrophies)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Current season trophies</dt>
                      <dd>{formatNumber(legendStats.currentSeason?.trophies)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Current season rank</dt>
                      <dd>{legendStats.currentSeason?.rank ? `#${legendStats.currentSeason.rank}` : "--"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Best season trophies</dt>
                      <dd>{formatNumber(legendStats.bestSeason?.trophies)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Best season rank</dt>
                      <dd>{legendStats.bestSeason?.rank ? `#${legendStats.bestSeason.rank}` : "--"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Previous season trophies</dt>
                      <dd>{formatNumber(legendStats.previousSeason?.trophies)}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}
              {builderCard}
              {capitalCard}
            </div>
          </section>
        ) : activeSection === "history" ? (
          <PlayerHistorySection
            loading={historyLoading}
            error={historyError}
            nameChanges={historyNameChanges}
            hasNameChange={historyHasNameChange}
            onRetry={handleHistoryRetry}
          />
        ) : (
          <section className="rounded-3xl bg-slate-950/70 p-6 text-white shadow-xl ring-1 ring-slate-700/40">
            <PlayerCollections player={player} section={activeSection} />
          </section>
        )}
      </div>
    </div>
  );
};

export default PlayerDetails;

