const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const PORT = process.env.PORT || 8081;
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const asyncHandler = require("express-async-handler");
const User = require("./models/User");

// CORS configuration

const allowedOrigin = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origin === allowedOrigin) {
        callback(null, true); 
      } else {
        callback(new Error("Not allowed by CORS")); 
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(cookieParser());

app.use(express.json());
const { ApiError, HandleError } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/user");

const fs = require("fs");
const cheerio = require("cheerio");
const {
  calculateRaidsCompleted,
  calculateOffensiveRaidMedals,
} = require("clashofclans.js");
const { Client } = require("clashofclans.js");
const client = new Client();
connect();

const MS_PER_DAY = 24 * 60 * 60 * 1000;

//--------------------------------
//-----------------------------
const getCurrentSeasonDayCount = () => {
  const now = new Date();
  const seasonStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
  );
  const diff = now.getTime() - seasonStart.getTime();
  return Math.max(1, Math.floor(diff / MS_PER_DAY) + 1);
};

async function connect() {
  try {
    await client.login({
      email: "clashofclanstest755@outlook.com",
      password: "clashofclanstest755",
    });
    console.log("connected successfully");
  } catch (error) {
    console.log(error);
  }
}
// clashofclanstest755@outlook.com
// Azerty123
var bodyParser = require("body-parser");
var path = require("path");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

process.env.PWD = process.cwd();
app.use(express.static(process.env.PWD + "/public"));

const sanitizeTag = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  let raw = value;
  if (typeof raw !== "string") {
    raw = String(raw);
  }

  try {
    raw = decodeURIComponent(raw);
  } catch (err) {
    raw = String(raw);
  }

  const trimmed = raw.trim().toUpperCase();
  if (!trimmed) {
    return "";
  }

  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
};

//----------------------------------
//-------------------------------
const DONATION_CLANS_FILE = path.join(
  process.env.PWD || __dirname,
  "public",
  "files",
  "DonationClans.json"
);

//--------------------------
const getVerifiedTagsFromDB = async () => {
  const users = await User.find(
    { "linkedClans.verify": true },
    { linkedClans: 1, email: 1 }
  );

  console.log("users with verified clans:", users.length);

  return users.flatMap((u) =>
    u.linkedClans.filter((c) => c.verify).map((c) => c.tag)
  );
};

const CLAN_TAG_REGEX = /^#[A-Z0-9]{3,}$/;

const normalizeDonationTag = (value) => {
  const sanitized = sanitizeTag(value);
  if (!sanitized) {
    return "";
  }

  const cleaned = sanitized.replace(/[^#A-Z0-9]/g, "");
  const tag = cleaned.startsWith("#") ? cleaned : `#${cleaned}`;
  return CLAN_TAG_REGEX.test(tag) ? tag : "";
};

const dedupeTags = (tags) => {
  const seen = new Set();
  return tags.filter((tag) => {
    if (seen.has(tag)) {
      return false;
    }
    seen.add(tag);
    return true;
  });
};

//----------------------------------
//-------------------------------
const readDonationClanTags = () => {
  try {
    if (!fs.existsSync(DONATION_CLANS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DONATION_CLANS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const normalized = parsed
      .map((tag) => normalizeDonationTag(tag))
      .filter(Boolean);
    return dedupeTags(normalized);
  } catch (error) {
    console.error(
      "[donations] Failed to read DonationClans.json:",
      error.message || error
    );
    return [];
  }
};

const writeDonationClanTags = (tags) => {
  const normalized = dedupeTags(
    tags.map((tag) => normalizeDonationTag(tag)).filter(Boolean)
  );
  fs.writeFileSync(
    DONATION_CLANS_FILE,
    JSON.stringify(normalized, null, 4),
    "utf-8"
  );
  return normalized;
};

const HISTORY_SOURCE_URL = "https://cc.fwafarm.com/cc_n/member.php";
const CLAN_HISTORY_SOURCE_URL = "https://cc.fwafarm.com/cc_n/clan.php";
const LOGIN_NOTICE_REGEX = /Please log in to view more details\.?/gi;

const normalizeLabel = (value = "") =>
  value
    .replace(/\s+/g, " ")
    .replace(/[:：]\s*$/, "")
    .trim()
    .toLowerCase();

const findLabelNode = ($, $root, label) => {
  if (!$root || !$root.length) {
    return null;
  }
  const target = normalizeLabel(label);
  const match = $root
    .find("b")
    .filter((_, el) => normalizeLabel($(el).text()) === target)
    .first();
  return match.length ? match : null;
};

const textFromNode = ($, node) => {
  if (!node) {
    return "";
  }
  if (node.type === "text") {
    return node.data || "";
  }
  return $(node).text();
};

const collectTextUntilBreak = ($, startNode) => {
  const parts = [];
  let cursor = startNode;
  while (cursor) {
    if (cursor.type === "tag" && cursor.name === "br") {
      break;
    }
    const value = textFromNode($, cursor).replace(/\s+/g, " ").trim();
    if (value) {
      parts.push(value);
    }
    cursor = cursor.nextSibling;
  }
  return parts;
};

const parsePlayerHistoryHtml = (html) => {
  const $ = cheerio.load(html);
  const trackedActions = [];
  const nameChanges = [];

  const headingSpan = $("span")
    .filter((_, el) => normalizeLabel($(el).text()).includes("tracked actions"))
    .first();
  const historyTable = headingSpan.length
    ? headingSpan.nextAll("table").first()
    : $("table").first();

  if (historyTable && historyTable.length) {
    historyTable
      .find("tr")
      .slice(1)
      .each((_, row) => {
        const cells = $(row).find("td");
        if (!cells || cells.length < 2) {
          return;
        }
        const timestamp = $(cells[0]).text().replace(/\s+/g, " ").trim();
        const actionCell = $(cells[1]);
        const rawAction = actionCell.text().replace(/\s+/g, " ").trim();
        const action = rawAction
          .replace(LOGIN_NOTICE_REGEX, " ")
          .replace(/\s+/g, " ")
          .trim();
        const clanCell = cells.length > 2 ? $(cells[2]) : null;
        const rawClanText = clanCell ? clanCell.text() : "";
        const clanText = rawClanText
          .replace(LOGIN_NOTICE_REGEX, " ")
          .replace(/\s+/g, " ")
          .trim();
        let clanName = clanText;
        let clanTag = "";
        let affiliation = "";

        if (clanCell && clanCell.length) {
          const firstLink = clanCell.find("a").first();
          if (firstLink.length) {
            clanName = firstLink.text().replace(/\s+/g, " ").trim() || clanName;
            const href = firstLink.attr("href") || "";
            const tagMatch = href.match(/tag=([^&]+)/i);
            if (tagMatch) {
              clanTag = decodeURIComponent(tagMatch[1])
                .replace(/^#/, "")
                .replace(/^%23/, "")
                .toUpperCase();
            }
          }
          const spanText = clanCell
            .find("span")
            .last()
            .text()
            .replace(LOGIN_NOTICE_REGEX, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (spanText) {
            affiliation = spanText.replace(/^\(|\)$/g, "");
          }
        }

        if (timestamp || action || clanName) {
          const clanInfo = {
            name: clanName,
            tag: clanTag,
            affiliation,
            raw: clanText,
          };
          const entry = {
            timestamp,
            action,
            clan: clanInfo,
          };
          trackedActions.push(entry);

          const lowerAction = action.toLowerCase();
          if (lowerAction.includes("changed name")) {
            let fromName = "";
            let toName = "";

            if (actionCell && actionCell.length) {
              const spanTexts = actionCell
                .find("span")
                .map((_, span) => $(span).text().replace(/\s+/g, " ").trim())
                .get()
                .filter(Boolean);
              if (spanTexts.length >= 2) {
                [fromName, toName] = spanTexts;
              }
            }

            if (!fromName || !toName) {
              const patterns = [
                {
                  pattern:
                    /changed(?: their)? name from\s+"?([^"']+?)"?\s+to\s+"?([^"']+?)"?/i,
                  fromIndex: 1,
                  toIndex: 2,
                },
                {
                  pattern:
                    /changed(?: their)? name to\s+"?([^"']+?)"?\s+from\s+"?([^"']+?)"?/i,
                  fromIndex: 2,
                  toIndex: 1,
                },
                {
                  pattern: /changed(?: their)? name to\s+"?([^"']+?)"?/i,
                  fromIndex: null,
                  toIndex: 1,
                },
                {
                  pattern: /changed(?: their)? name from\s+"?([^"']+?)"?/i,
                  fromIndex: 1,
                  toIndex: null,
                },
              ];

              for (const { pattern, fromIndex, toIndex } of patterns) {
                const match = action.match(pattern);
                if (!match) {
                  continue;
                }

                if (!fromName && fromIndex !== null && match[fromIndex]) {
                  fromName = match[fromIndex];
                }
                if (!toName && toIndex !== null && match[toIndex]) {
                  toName = match[toIndex];
                }

                if (fromName && toName) {
                  break;
                }
              }
            }

            const clean = (value) => {
              if (!value) {
                return "";
              }
              return String(value)
                .replace(/\s+/g, " ")
                .trim()
                .replace(/^"|"$/g, "");
            };

            fromName = clean(fromName);
            toName = clean(toName);

            if (timestamp || fromName || toName) {
              nameChanges.push({
                timestamp,
                from: fromName || null,
                to: toName || null,
              });
            }
          }
        }
      });
  }

  const topSpan = $("#top");
  const names = [];
  let hasNameChange = false;
  let currentClan = null;

  if (topSpan && topSpan.length) {
    const namesLabel = findLabelNode($, topSpan, "names");
    if (namesLabel) {
      const collected = collectTextUntilBreak($, namesLabel[0].nextSibling);
      collected
        .join(" ")
        .split(/[,|]/)
        .map((item) => item.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .forEach((name) => {
          if (!names.includes(name)) {
            names.push(name);
          }
        });
    }

    hasNameChange = topSpan.text().toLowerCase().includes("changed their name");

    const clanLabel = findLabelNode($, topSpan, "current clan");
    if (clanLabel) {
      const info = { name: "", tag: "", affiliation: "" };
      let cursor = clanLabel[0].nextSibling;
      while (cursor && !(cursor.type === "tag" && cursor.name === "br")) {
        if (cursor.type === "tag" && cursor.name === "a") {
          const anchor = $(cursor);
          const text = anchor.text().replace(/\s+/g, " ").trim();
          if (text) {
            info.name = info.name || text;
          }
          const href = anchor.attr("href") || "";
          const tagMatch = href.match(/tag=([^&]+)/i);
          if (tagMatch) {
            info.tag = decodeURIComponent(tagMatch[1])
              .replace(/^#/, "")
              .replace(/^%23/, "")
              .toUpperCase();
          }
        } else {
          const text = textFromNode($, cursor).replace(/\s+/g, " ").trim();
          if (text) {
            if (!info.name) {
              info.name = text.replace(/^\(|\)$/g, "");
            } else if (!info.affiliation) {
              info.affiliation = text.replace(/^\(|\)$/g, "");
            }
          }
        }
        cursor = cursor.nextSibling;
      }

      if (info.name || info.tag || info.affiliation) {
        currentClan = info;
      }
    }
  }

  return {
    trackedActions,
    nameChanges,
    names,
    hasNameChange,
    currentClan,
  };
};

const parseClanHistoryHtml = (html) => {
  const $ = cheerio.load(html);
  const nameChanges = [];

  const activityHeading = $("span")
    .filter((_, el) => normalizeLabel($(el).text()).includes("clan activity"))
    .first();

  let historyTable = activityHeading.length
    ? activityHeading.nextAll("table").first()
    : null;

  if (!historyTable || !historyTable.length) {
    historyTable = $("table")
      .filter((_, table) => {
        const headerText = $(table)
          .find("tr")
          .first()
          .text()
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase();
        return (
          headerText.includes("timestamp") && headerText.includes("action")
        );
      })
      .first();
  }

  if (historyTable && historyTable.length) {
    historyTable
      .find("tr")
      .slice(1)
      .each((_, row) => {
        const cells = $(row).find("td");
        if (!cells || cells.length < 2) {
          return;
        }
        const timestamp = $(cells[0]).text().replace(/\s+/g, " ").trim();
        const actionCell = $(cells[1]);
        const rawAction = actionCell.text().replace(/\s+/g, " ").trim();
        const action = rawAction
          .replace(LOGIN_NOTICE_REGEX, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (!timestamp || !action) {
          return;
        }

        if (!action.toLowerCase().includes("changed clan name")) {
          return;
        }

        const spans = actionCell.find("span");
        const fromName = spans.eq(0).text().replace(/\s+/g, " ").trim();
        const toName = spans.eq(1).text().replace(/\s+/g, " ").trim();

        nameChanges.push({
          timestamp,
          from: fromName || null,
          to: toName || null,
        });
      });
  }

  return { nameChanges };
};

const fetchClanHistorySnapshot = async (tag, options = {}) => {
  const normalizedTag = (tag || "").replace(/^#/, "").trim();
  if (!normalizedTag) {
    const error = new Error("invalid_tag");
    error.code = "invalid_tag";
    throw error;
  }

  const url = `${CLAN_HISTORY_SOURCE_URL}?tag=${encodeURIComponent(
    normalizedTag
  )}`;
  const response = await fetch(url, {
    signal: options.signal,
    headers: {
      "User-Agent":
        "clashsite-clan-history-fetch/1.0 (+https://cc.fwafarm.com/)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (response.status === 404) {
    return {
      nameChanges: [],
      source: "not_found",
    };
  }

  if (!response.ok) {
    const error = new Error(`clan_history_request_failed_${response.status}`);
    error.status = response.status;
    throw error;
  }

  const html = await response.text();
  const parsed = parseClanHistoryHtml(html);
  return {
    ...parsed,
    source: "ok",
  };
};

const fetchPlayerHistorySnapshot = async (tag, options = {}) => {
  const normalizedTag = (tag || "").replace(/^#/, "").trim();
  if (!normalizedTag) {
    const error = new Error("invalid_tag");
    error.code = "invalid_tag";
    throw error;
  }

  const baseHeaders = {
    "User-Agent": "clashsite-history-fetch/1.0 (+https://cc.fwafarm.com/)",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  };

  const attemptVariants = [{}, { rlim: 120 }, { rlim: 200 }];

  const aggregated = {
    trackedActions: [],
    nameChanges: [],
    names: [],
    hasNameChange: false,
    currentClan: null,
  };

  const seenTrackedActions = new Set();
  const seenNameChanges = new Set();
  const seenNames = new Set();

  const appendTrackedAction = (entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const clan = entry.clan || {};
    const key = [
      entry.timestamp || "",
      entry.action || "",
      clan.tag || "",
      clan.name || "",
      clan.affiliation || "",
    ].join("|");
    if (seenTrackedActions.has(key)) {
      return;
    }
    seenTrackedActions.add(key);
    aggregated.trackedActions.push(entry);
  };

  const appendNameChange = (entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const key = [entry.timestamp || "", entry.from || "", entry.to || ""].join(
      "|"
    );
    if (seenNameChanges.has(key)) {
      return;
    }
    seenNameChanges.add(key);
    aggregated.nameChanges.push(entry);
  };

  const appendName = (value) => {
    if (!value) {
      return;
    }
    const normalized = String(value).trim();
    if (!normalized) {
      return;
    }
    const key = normalized.toLowerCase();
    if (seenNames.has(key)) {
      return;
    }
    seenNames.add(key);
    aggregated.names.push(normalized);
  };

  const toSortableTimestamp = (value) => {
    if (!value) {
      return Number.NEGATIVE_INFINITY;
    }
    const normalized = String(value).trim();
    if (!normalized) {
      return Number.NEGATIVE_INFINITY;
    }
    const isoLike = normalized.replace(/\s+/g, " ");
    const precise = isoLike.replace(" ", "T");
    const parsed = new Date(precise);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.getTime();
    }
    const fallback = Date.parse(isoLike);
    return Number.isNaN(fallback) ? Number.NEGATIVE_INFINITY : fallback;
  };

  let usedVariantIndex = 0;

  for (let index = 0; index < attemptVariants.length; index += 1) {
    if (index > 0 && aggregated.nameChanges.length > 0) {
      break;
    }
    if (index > 0 && !aggregated.hasNameChange && !options.forceDeep) {
      break;
    }

    const params = attemptVariants[index];
    const searchParams = new URLSearchParams({ tag: normalizedTag });
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      if (
        paramValue !== undefined &&
        paramValue !== null &&
        `${paramValue}` !== ""
      ) {
        searchParams.set(paramKey, String(paramValue));
      }
    });

    const url = `${HISTORY_SOURCE_URL}?${searchParams.toString()}`;
    const response = await fetch(url, {
      signal: options.signal,
      headers: baseHeaders,
    });

    if (response.status === 404) {
      return {
        trackedActions: [],
        nameChanges: [],
        names: [],
        hasNameChange: false,
        currentClan: null,
        source: "not_found",
      };
    }

    if (!response.ok) {
      const error = new Error(`history_request_failed_${response.status}`);
      error.status = response.status;
      throw error;
    }

    const html = await response.text();
    const parsed = parsePlayerHistoryHtml(html);

    if (Array.isArray(parsed.trackedActions)) {
      parsed.trackedActions.forEach(appendTrackedAction);
    }
    if (Array.isArray(parsed.nameChanges)) {
      parsed.nameChanges.forEach(appendNameChange);
    }
    if (Array.isArray(parsed.names)) {
      parsed.names.forEach(appendName);
    }

    aggregated.hasNameChange = aggregated.hasNameChange || parsed.hasNameChange;
    if (!aggregated.currentClan && parsed.currentClan) {
      aggregated.currentClan = parsed.currentClan;
    }

    usedVariantIndex = index;

    const shouldContinue =
      aggregated.nameChanges.length === 0 &&
      (aggregated.hasNameChange || options.forceDeep) &&
      index < attemptVariants.length - 1;

    if (!shouldContinue) {
      break;
    }
  }

  if (!aggregated.hasNameChange && aggregated.nameChanges.length > 0) {
    aggregated.hasNameChange = true;
  }

  const sortByTimestampDesc = (list) =>
    list.slice().sort((a, b) => {
      const diff =
        toSortableTimestamp(b && b.timestamp) -
        toSortableTimestamp(a && a.timestamp);
      if (diff !== 0) {
        return diff;
      }
      const aLabel = (a && a.timestamp) || "";
      const bLabel = (b && b.timestamp) || "";
      return bLabel.localeCompare(aLabel);
    });

  aggregated.trackedActions = sortByTimestampDesc(aggregated.trackedActions);
  aggregated.nameChanges = sortByTimestampDesc(aggregated.nameChanges);

  return {
    ...aggregated,
    source: usedVariantIndex > 0 ? "expanded" : "ok",
  };
};

app.get("/players/:tag/history", async (req, res) => {
  const sanitizedTag = sanitizeTag(req.params.tag);

  if (!sanitizedTag) {
    return res.status(400).json({ success: 0, error: "invalid_tag" });
  }

  try {
    const historySnapshot = await fetchPlayerHistorySnapshot(sanitizedTag);
    return res.json({
      success: 1,
      ...historySnapshot,
    });
  } catch (error) {
    if (error && error.code === "invalid_tag") {
      return res.status(400).json({ success: 0, error: "invalid_tag" });
    }
    if (error && error.name === "AbortError") {
      return;
    }
    console.error(
      "player history fetch error:",
      error && error.message ? error.message : error,
      "tag:",
      req.params.tag
    );
    return res.status(502).json({ success: 0, error: "history_unavailable" });
  }
});

app.get("/clans/:tag/history", async (req, res) => {
  const sanitizedTag = sanitizeTag(req.params.tag);

  if (!sanitizedTag) {
    return res.status(400).json({ success: 0, error: "invalid_tag" });
  }

  try {
    const historySnapshot = await fetchClanHistorySnapshot(sanitizedTag);
    return res.json({
      success: 1,
      nameChanges: Array.isArray(historySnapshot.nameChanges)
        ? historySnapshot.nameChanges
        : [],
      source: historySnapshot.source || "ok",
    });
  } catch (error) {
    if (error && error.code === "invalid_tag") {
      return res.status(400).json({ success: 0, error: "invalid_tag" });
    }
    if (error && error.name === "AbortError") {
      return;
    }
    console.error(
      "clan history fetch error:",
      error && error.message ? error.message : error,
      "tag:",
      req.params.tag
    );
    return res.status(502).json({ success: 0, error: "history_unavailable" });
  }
});

app.post("/clansoflocation", async function (req, res) {
  try {
    var data = req.body;
    var clans = await client.getClanRanks(data.locationID);
    return res.json({ success: 1, clans: clans });
  } catch (error) {
    // Gracefully handle notFound or other errors
    if (error && (error.reason === "notFound" || error.status === 404)) {
      return res.json({ success: 1, clans: [] });
    }
    console.error("clansoflocation error:", error);
    return res.json({ success: 0 });
  }
});

app.get("/clanbytag/:tag", async function (req, res) {
  try {
    let tag = req.params.tag || "";
    try {
      tag = decodeURIComponent(tag);
    } catch {}
    tag = tag.trim();

    // من غير ما نضيف #
    if (!tag || tag.length < 3) {
      return res.json({ success: 0, error: "invalid_tag" });
    }

    const clanInfo = await client.getClan(tag); // زي ما هو جالك
    return res.json({ success: 1, clanInfo });
  } catch (error) {
    console.error("clanbytag error:", error.message, "req.params:", req.params);
    return res.json({
      success: 0,
      error: error.reason || error.message || "unknown_error",
    });
  }
});

app.post("/clanbytagForDetails", async function (req, res) {
  const data = req.body || {};
  try {
    let raw = (data.tag || "").toString();
    try {
      raw = decodeURIComponent(raw);
    } catch {}
    raw = raw.trim();
    const tag = raw.startsWith("#") ? raw : raw ? "#" + raw : "";
    if (!tag || tag.length < 3) {
      return res.json({ success: 0, error: "invalid_tag" });
    }
    const clanInfo = await client.getClan(tag);
    return res.json({ success: 1, clanInfo });
  } catch (error) {
    console.error(
      "clanbytag error:",
      error && error.message ? error.message : error,
      "req.body:",
      req.body
    );
    return res.json({
      success: 0,
      error:
        (error && error.reason) || (error && error.message) || "unknown_error",
    });
  }
});

app.post("/playerbytag", async function (req, res) {
  const data = req.body || {};
  try {
    // Normalize tag: allow with/without '#', decode possible %23
    let raw = (data.tag || "").toString();
    try {
      raw = decodeURIComponent(raw);
    } catch {}
    raw = raw.trim();
    const tag = raw.startsWith("#") ? raw : raw ? "#" + raw : "";

    if (!tag || tag.length < 3) {
      return res.json({ success: 0, error: "invalid_tag" });
    }

    const playerInfo = await client.getPlayer(tag);
    return res.json({ success: 1, playerInfo });
  } catch (error) {
    console.error(
      "playerbytag error:",
      error && error.message ? error.message : error,
      "req.body:",
      req.body
    );
    return res.json({
      success: 0,
      error:
        (error && error.reason) || (error && error.message) || "unknown_error",
    });
  }
});

app.get("/clans/:tag/capitalraid", async function (req, res) {
  const normalizedTag = sanitizeTag(req.params.tag);

  if (!normalizedTag) {
    return res.status(400).json({ success: 0, error: "invalid_tag" });
  }

  const limitParam = Number(req.query.limit);
  const limit =
    Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(Math.floor(limitParam), 10)
      : 3;

  try {
    const seasons = await client.getCapitalRaidSeasons(normalizedTag, {
      limit,
    });

    const normalized = (Array.isArray(seasons) ? seasons : []).map((season) => {
      const attackLog = Array.isArray(season.attackLog) ? season.attackLog : [];
      const defenseLog = Array.isArray(season.defenseLog)
        ? season.defenseLog
        : [];
      const raidsCompleted =
        typeof season.raidsCompleted === "number"
          ? season.raidsCompleted
          : calculateRaidsCompleted(attackLog);
      const calculatedMedals = calculateOffensiveRaidMedals(attackLog);

      const members = Array.isArray(season.members)
        ? season.members
            .map((member) => ({
              tag: member.tag,
              name: member.name,
              attacks: member.attacks,
              attackLimit: member.attackLimit,
              bonusAttackLimit: member.bonusAttackLimit,
              capitalResourcesLooted: member.capitalResourcesLooted,
            }))
            .sort(
              (a, b) =>
                (b.capitalResourcesLooted || 0) -
                (a.capitalResourcesLooted || 0)
            )
        : [];

      const attackLogSummary = attackLog.map((entry) => ({
        defender: entry.defender
          ? {
              tag: entry.defender.tag,
              name: entry.defender.name,
              level: entry.defender.level,
              badgeUrls: entry.defender.badgeUrls,
            }
          : null,
        attackCount: entry.attackCount,
        districtCount: entry.districtCount,
        districtsDestroyed: entry.districtsDestroyed,
        districts: Array.isArray(entry.districts)
          ? entry.districts.map((district) => ({
              id: district.id,
              name: district.name,
              hallLevel: district.districtHallLevel,
              destructionPercent: district.destructionPercent,
              attackCount: district.attackCount,
              totalLooted: district.totalLooted,
            }))
          : [],
      }));

      const defenseLogSummary = defenseLog.map((entry) => ({
        attacker: entry.attacker
          ? {
              tag: entry.attacker.tag,
              name: entry.attacker.name,
              level: entry.attacker.level,
              badgeUrls: entry.attacker.badgeUrls,
            }
          : null,
        attackCount: entry.attackCount,
        districtCount: entry.districtCount,
        districtsDestroyed: entry.districtsDestroyed,
        districts: Array.isArray(entry.districts)
          ? entry.districts.map((district) => ({
              id: district.id,
              name: district.name,
              hallLevel: district.districtHallLevel,
              destructionPercent: district.destructionPercent,
              attackCount: district.attackCount,
              totalLooted: district.totalLooted,
            }))
          : [],
      }));

      return {
        state: season.state,
        startTime: season.startTime,
        endTime: season.endTime,
        seasonId: season.startTime,
        capitalTotalLoot: season.capitalTotalLoot,
        raidsCompleted,
        totalAttacks: season.totalAttacks,
        enemyDistrictsDestroyed: season.enemyDistrictsDestroyed,
        offensiveReward: season.offensiveReward || calculatedMedals,
        defensiveReward: season.defensiveReward,
        members,
        attackLog: attackLogSummary,
        defenseLog: defenseLogSummary,
        metrics: {
          calculatedRaidsCompleted: calculateRaidsCompleted(attackLog),
          calculatedOffensiveRaidMedals: calculatedMedals,
        },
      };
    });

    return res.json({ success: 1, seasons: normalized });
  } catch (error) {
    console.error(
      "capitalraid error:",
      error && error.message ? error.message : error,
      "req.params:",
      req.params,
      "req.query:",
      req.query
    );
    return res.json({
      success: 0,
      error:
        (error && error.reason) ||
        (error && error.message) ||
        "failed_to_fetch_capital_raid",
    });
  }
});

app.get("/admin/donation-clans", (req, res) => {
  try {
    const clans = readDonationClanTags();
    res.json({ clans });
  } catch (error) {
    console.error("[donations] Failed to load donation clans:", error);
    res.status(500).json({ message: "Unable to load donation clans." });
  }
});

app.put("/admin/donation-clans", (req, res) => {
  try {
    const payload = req.body || {};
    const incoming = Array.isArray(payload.clans) ? payload.clans : null;

    if (!incoming) {
      return res
        .status(400)
        .json({ message: "Request body must include a clans array." });
    }

    const normalized = [];
    const invalid = [];

    incoming.forEach((tag) => {
      const normalizedTag = normalizeDonationTag(tag);
      if (normalizedTag) {
        normalized.push(normalizedTag);
      } else {
        const rawValue = tag === undefined || tag === null ? "" : String(tag);
        if (rawValue.trim() !== "") {
          invalid.push(rawValue);
        }
      }
    });

    if (invalid.length) {
      return res.status(400).json({
        message: "One or more clan tags are invalid.",
        invalid,
      });
    }

    const saved = writeDonationClanTags(normalized);
    return res.json({ clans: saved });
  } catch (error) {
    console.error("[donations] Failed to save donation clans:", error);
    return res.status(500).json({ message: "Unable to save donation clans." });
  }
});

app.get("/clanwar/:tag", async function (req, res) {
  try {
    let tag = req.params.tag || "";
    try {
      tag = decodeURIComponent(tag);
    } catch {}
    tag = tag.trim();

    if (!tag || tag.length < 3) {
      return res.json({ success: 0, error: "invalid_tag" });
    }

    const currentWar = await client.getClanWar(tag);
    return res.json({ success: 1, currentWar });
  } catch (error) {
    console.error("clanwar error:", error.message, "req.params:", req.params);
    return res.json({
      success: 0,
      error: error.reason || error.message || "unknown_error",
    });
  }
});

//---------------------------------------------------------------
//------------------------------------------

app.get(
  "/donationsclans",
  asyncHandler(async (req, res) => {
    // 1. هات كل tags من DonationClans.json
    const donationClans = readDonationClanTags();

    // 2. هات كل tags المؤكدة من الـ DB
    const verifiedTags = await getVerifiedTagsFromDB();

    // 3. دمج الاتنين مع بعض (وإزالة التكرار)
    const allTags = Array.from(new Set([...donationClans, ...verifiedTags]));

    // 4. نفس منطق الترتيب اللي عندك
    const seasonDayCount = getCurrentSeasonDayCount();
    const clansranking = [];

    for (const clanTag of allTags) {
      const clanInfo = await client.getClan(clanTag);
      const members = Array.isArray(clanInfo.members) ? clanInfo.members : [];
      let totalDonations = 0;
      let totalDonationsReceived = 0;

      for (const member of members) {
        totalDonations += member?.donations || 0;
        totalDonationsReceived += member?.received || 0;
      }

      const totalSeasonDonations = totalDonations + totalDonationsReceived;
      const averageDailyDonations = Math.round(
        totalSeasonDonations / seasonDayCount
      );

      const badgeUrl =
        (clanInfo.badge && clanInfo.badge.url) ||
        (clanInfo.badgeUrls &&
          (clanInfo.badgeUrls.large ||
            clanInfo.badgeUrls.medium ||
            clanInfo.badgeUrls.small)) ||
        "";

      const nameAndTag = `${clanInfo.name}<br>${clanTag}`;

      clansranking.push([
        badgeUrl ? `<img src="${badgeUrl}" alt="logo"></img>` : "",
        nameAndTag,
        totalDonations,
        totalDonationsReceived,
        totalSeasonDonations,
        averageDailyDonations,
        clanTag,
        badgeUrl,
        clanInfo.name || "",
      ]);
    }

    // ممكن هنا تعمل sort/clansranking حسب اللي تحبه مثلاً بالـ totalSeasonDonations
    clansranking.sort((a, b) => b[4] - a[4]); // sort by totalSeasonDonations descending

    res.json({
      success: 1,
      verifiedTags, // عشان تعرفهم لوحدهم
      clansranking,
    });
  })
);

app.post("/players/:playerTag/verifytoken", async (req, res) => {
  const { playerTag } = req.params;

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // const tag = playerTag.replace(/#/g, "%23");
    const tag = "%23" + playerTag;

    const response = await fetch(
      `https://api.clashofclans.com/v1/players/${tag}/verifytoken`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLASH}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
 
app.use(userRoutes);
app.use(authRoutes);

app.use(HandleError);

// any error not  from express
process.on("unhandledRejection", (err) => {
  console.log("unhandledRehection", err.message);
  process.exit(1);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("ok Connected to MongoDB "))
  .catch((err) => {
    console.error("? MongoDB connection error:", err.message);
  });

// const host = '0.0.0.0';
app.listen(PORT, () => {
  console.log(`Node app is running on port ${PORT}`);
});
