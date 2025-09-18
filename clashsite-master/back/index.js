const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const PORT = process.env.PORT || 8081;
const mongoose = require("mongoose");
app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/authRoutes");


const fs = require("fs");
const { calculateRaidsCompleted, calculateOffensiveRaidMedals } = require("clashofclans.js");
const { Client } = require("clashofclans.js");
const client = new Client();
connect();

const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean)
  : null;
if (corsOrigins && corsOrigins.length > 0) {
  app.use(cors({ origin: corsOrigins }));
} else {
  app.use(cors());
}

process.env.PWD = process.cwd();
app.use(express.static(process.env.PWD + "/public"));

app.use(userRoutes);


const sanitizeTag = (value) => {
  if (value === undefined || value === null) {
    return '';
  }

  let raw = value;
  if (typeof raw !== 'string') {
    raw = String(raw);
  }

  try {
    raw = decodeURIComponent(raw);
  } catch (err) {
    raw = String(raw);
  }

  const trimmed = raw.trim().toUpperCase();
  if (!trimmed) {
    return '';
  }

  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
};

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
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(Math.floor(limitParam), 10) : 3;

  try {
    const seasons = await client.getCapitalRaidSeasons(normalizedTag, { limit });

    const normalized = (Array.isArray(seasons) ? seasons : []).map((season) => {
      const attackLog = Array.isArray(season.attackLog) ? season.attackLog : [];
      const defenseLog = Array.isArray(season.defenseLog) ? season.defenseLog : [];
      const raidsCompleted =
        typeof season.raidsCompleted === 'number'
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
            .sort((a, b) => (b.capitalResourcesLooted || 0) - (a.capitalResourcesLooted || 0))
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

app.get("/donationsclans", async function (req, res) {
  var data = req.body;
  const clans = JSON.parse(
    fs.readFileSync("./public/files/DonationClans.json")
  );
  var clansranking = [];
  const seasonDayCount = getCurrentSeasonDayCount();
  for (let j = 0; j < clans.length; j++) {
    const clanTag = clans[j];
    const clanInfo = await client.getClan(clanTag);
    const members = Array.isArray(clanInfo.members) ? clanInfo.members : [];
    let totalDonations = 0;
    let totalDonationsReceived = 0;
    for (let i = 0; i < members.length; i++) {
      const member = members[i] || {};
      totalDonations += member.donations || 0;
      totalDonationsReceived += member.received || 0;
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
      '';
    const nameAndTag = clanInfo.name + "<br>" + clanTag;

    clansranking.push([
      badgeUrl ? '<img src="' + badgeUrl + '" alt="logo"></img>' : '',
      nameAndTag,
      totalDonations,
      totalDonationsReceived,
      totalSeasonDonations,
      averageDailyDonations,
      clanTag,
      badgeUrl,
      clanInfo.name || '',
    ]);
  }
  res.json({ success: 1, clansranking: clansranking });
});

  


app.post("/players/:playerTag/verifytoken", async (req, res) => {
  const { playerTag } = req.params;

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  console.log(token)

  try {
    // const tag = playerTag.replace(/#/g, "%23");
    const tag = "%23"+playerTag
    console.log(tag)

    const response = await fetch(
      `https://api.clashofclans.com/v1/players/${tag}/verifytoken`,
      {
        method: "POST",
        headers: {
          Authorization: `${process.env.CLAH}`,
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


// app.post("/players/:playerTag/verifytoken", async (req, res) => {
//   const { playerTag } = req.params; // ????? "#GUJ82JL0Q" ???????? ?? ???? encode ??
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({ message: "Token is required" });
//   }

//   try {
//     // ???? # ?? %23 ??? ???? ??? API
//     const tag = playerTag.replace(/#/g, "%23");

//     const response = await fetch(
//       `https://api.clashofclans.com/v1/players/${tag}/verifytoken`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.CLAH}`, // ???? Bearer
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ token }),
//       }
//     );

//     const data = await response.json();
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });





// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Node app is running on http://localhost:${PORT}`);
});

