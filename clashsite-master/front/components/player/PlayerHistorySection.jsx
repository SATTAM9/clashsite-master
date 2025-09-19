const FALLBACK_TIMESTAMP_PATTERN = /(\d{4}-\d{2}-\d{2}|\d{2}[./]\d{2}[./]\d{4})(?:\s+|T)?(\d{2}:\d{2}(?::\d{2})?)?/;

const formatTimestamp = (value) => {
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
  const fallback = normalized.match(FALLBACK_TIMESTAMP_PATTERN);
  if (fallback) {
    const [, datePart, timePart] = fallback;
    return [datePart, timePart || ""].filter(Boolean).join(" " );
  }
  return normalized;
};

const cleanName = (value) => {
  if (!value) {
    return "";
  }
  return String(value).replace(/\s+/g, " ").trim().replace(/^"|"$/g, "");
};

const parseNamesFromText = (text) => {
  if (!text) {
    return { from: "", to: "" };
  }
  const matchFromTo = text.match(/changed(?: their)? name from\s+"?([^"']+?)"?\s+to\s+"?([^"']+?)"?/i);
  if (matchFromTo) {
    return { from: cleanName(matchFromTo[1]), to: cleanName(matchFromTo[2]) };
  }
  const matchToFrom = text.match(/changed(?: their)? name to\s+"?([^"']+?)"?\s+from\s+"?([^"']+?)"?/i);
  if (matchToFrom) {
    return { from: cleanName(matchToFrom[2]), to: cleanName(matchToFrom[1]) };
  }
  const matchToOnly = text.match(/changed(?: their)? name to\s+"?([^"']+?)"?/i);
  if (matchToOnly) {
    return { from: "", to: cleanName(matchToOnly[1]) };
  }
  const matchFromOnly = text.match(/changed(?: their)? name from\s+"?([^"']+?)"?/i);
  if (matchFromOnly) {
    return { from: cleanName(matchFromOnly[1]), to: "" };
  }
  return { from: "", to: "" };
};

const normalizeNameChange = (change, index) => {
  if (change === null || change === undefined) {
    return null;
  }

  if (typeof change === "string") {
    const timestamp = formatTimestamp(change);
    const label = timestamp || "Timestamp unavailable";
    return {
      key: `${label}-${index}`,
      timestamp: label,
      from: "",
      to: "",
    };
  }

  if (typeof change !== "object") {
    return null;
  }

  const timestampSource = change.timestamp || change.time || change.date || change.when || change.raw || change.value || "";
  let timestamp = formatTimestamp(timestampSource);
  if (!timestamp && change.action) {
    timestamp = formatTimestamp(change.action);
  }
  if (!timestamp && change.description) {
    timestamp = formatTimestamp(change.description);
  }

  const directFrom = cleanName(change.from || change.previous || change.old || "");
  const directTo = cleanName(change.to || change.current || change.new || "");

  let { from, to } = { from: directFrom, to: directTo };
  if (!from && !to) {
    const parsed = parseNamesFromText(change.action || change.description || change.detail || "");
    from = parsed.from;
    to = parsed.to;
  }

  if (!timestamp && !from && !to) {
    return null;
  }

  const label = timestamp || "Timestamp unavailable";

  return {
    key: `${label}-${index}`,
    timestamp: label,
    from,
    to,
  };
};

const normalizeClanEntry = (entry, index) => {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const timestampLabel = formatTimestamp(
    entry.timestamp || entry.time || entry.when || ""
  );
  const timestamp = timestampLabel || "Timestamp unavailable";
  const rawAction = typeof entry.action === "string" ? entry.action : "";
  const action = rawAction.replace(/\s+/g, " " ).trim() || "Action details unavailable";
  const clanInfo = entry.clan && typeof entry.clan === "object" ? entry.clan : {};
  const clanName = cleanName(entry.clanName || clanInfo.name || clanInfo.raw || "");
  const normalizedTag = String(entry.clanTag || clanInfo.tag || "").replace(/^#/, "").toUpperCase();
  const clanTag = normalizedTag ? `#${normalizedTag}` : "";
  const clanAffiliation = cleanName(entry.clanAffiliation || clanInfo.affiliation || "");
  return {
    key: entry.key || `${timestamp}-${index}`,
    timestamp,
    action,
    clanName,
    clanTag,
    clanAffiliation,
  };
};

const PlayerHistorySection = ({
  loading,
  error,
  nameChanges = [],
  clanHistory = [],
  hasNameChange = false,
  onRetry,
}) => {
  const normalizedChanges = Array.isArray(nameChanges)
    ? nameChanges
        .map((change, index) => normalizeNameChange(change, index))
        .filter(Boolean)
    : [];
  const normalizedClanHistory = Array.isArray(clanHistory)
    ? clanHistory
        .map((entry, index) => normalizeClanEntry(entry, index))
        .filter(Boolean)
    : [];

  const hasChanges = normalizedChanges.length > 0;
  const hasClanHistory = normalizedClanHistory.length > 0;

  const nameHistoryContent = hasChanges ? (
    <ul className="space-y-3">
      {normalizedChanges.map((entry) => {
        const hasFrom = Boolean(entry.from);
        const hasTo = Boolean(entry.to);
        const fromLabel = hasFrom ? entry.from : "";
        const toLabel = hasTo ? entry.to : "";
        const tooltip = hasFrom || hasTo
          ? `Changed player name${hasFrom ? ` from ${fromLabel}` : ""}${hasTo ? ` to ${toLabel}` : ""}`
          : "Changed player name (previous/current names unavailable)";

        return (
          <li key={entry.key}>
            <div
              className="grid gap-2 rounded-2xl bg-slate-900/70 px-5 py-4 ring-1 ring-slate-800/60 sm:grid-cols-[auto,1fr] sm:items-center"
              title={tooltip}
            >
              <span className="text-lg font-semibold text-white">{entry.timestamp}</span>
              <div className="text-sm text-slate-300">
                <span className="font-medium text-slate-100">Changed player name</span>
                {hasFrom || hasTo ? (
                  <div className="mt-1">
                    {hasFrom ? (
                      <>
                        <span>from </span>
                        <span className="font-semibold text-amber-300">{fromLabel}</span>
                      </>
                    ) : null}
                    {hasFrom && hasTo ? <span> to </span> : null}
                    {!hasFrom && hasTo ? <span>to </span> : null}
                    {hasTo ? <span className="font-semibold text-emerald-300">{toLabel}</span> : null}
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-slate-400">
                    Name change detected, but detailed names were not provided by ChocolateClash.
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  ) : (
    <div className="rounded-2xl bg-slate-900/70 p-6 text-center text-sm text-slate-300 ring-1 ring-slate-800/40">
      {hasNameChange
        ? "ChocolateClash detected a name change, but detailed timestamps require staff access."
        : "No player name changes have been recorded yet."}
    </div>
  );

  const clanHistoryContent = hasClanHistory ? (
    <ul className="space-y-3">
      {normalizedClanHistory.map((entry) => {
        const hasContext = entry.clanName || entry.clanTag || entry.clanAffiliation;
        return (
          <li key={entry.key}>
            <div className="grid gap-2 rounded-2xl bg-slate-900/70 px-5 py-4 ring-1 ring-slate-800/60 sm:grid-cols-[auto,1fr] sm:items-center">
              <span className="text-lg font-semibold text-white">{entry.timestamp}</span>
              <div className="text-sm text-slate-300">
                <span className="font-medium text-slate-100">{entry.action}</span>
                {hasContext ? (
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    {entry.clanName ? (
                      <span className="font-semibold text-emerald-300">{entry.clanName}</span>
                    ) : null}
                    {entry.clanTag ? (
                      <span className="rounded-full bg-slate-800/60 px-2 py-0.5 font-mono text-slate-200">{entry.clanTag}</span>
                    ) : null}
                    {entry.clanAffiliation ? <span>{entry.clanAffiliation}</span> : null}
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  ) : (
    <div className="rounded-2xl bg-slate-900/70 p-6 text-center text-sm text-slate-300 ring-1 ring-slate-800/40">
      No clan history entries have been recorded yet.
    </div>
  );

  return (
    <section className="rounded-3xl bg-slate-950/70 p-8 text-white shadow-xl ring-1 ring-slate-700/40">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold tracking-tight">Player History</h3>
        {loading ? <span className="text-sm text-slate-400">Loading...</span> : null}
      </div>

      {loading ? (
        <div className="flex min-h-[120px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
          <span className="sr-only">Loading player history</span>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-slate-900/70 p-6 text-sm text-red-300 ring-1 ring-red-500/40">
          <p>{error}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-red-500/20 px-4 py-1.5 text-sm font-semibold text-red-100 transition hover:bg-red-500/30"
            >
              Try again
            </button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h4 className="text-xl font-semibold text-slate-100">Name Changes</h4>
            {nameHistoryContent}
          </div>
          <div>
            <h4 className="text-xl font-semibold text-slate-100">Clan Activity</h4>
            {clanHistoryContent}
          </div>
        </div>
      )}
    </section>
  );
};

export default PlayerHistorySection;


