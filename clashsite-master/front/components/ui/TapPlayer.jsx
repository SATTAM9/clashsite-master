import { useEffect, useMemo, useState } from "react";

const ICON_BASE_PATH = "/assets/coc/icons";

const ICON_DIRS = {
  troops: ["troops", "super-troop-pics", "bb-troops", "pets", "siege"],
  spells: ["spells"],
  heroes: ["heroes", "bb-heroes"],
  equipment: ["equipment"],
  achievements: [],
};

const ICONS = {
  home: {
    troops: {
      'Barbarian': 'troops/Icon_HV_Barbarian.png',
      'Archer': 'troops/Icon_HV_Archer.png',
      'Giant': 'troops/Icon_HV_Giant.png',
      'Goblin': 'troops/Icon_HV_Goblin.png',
      'Wall Breaker': 'troops/Icon_HV_Wall_Breaker.png',
      'Balloon': 'troops/Icon_HV_Balloon.png',
      'Wizard': 'troops/Icon_HV_Wizard.png',
      'Healer': 'troops/Icon_HV_Healer.png',
      'Dragon': 'troops/Icon_HV_Dragon.png',
      'P.E.K.K.A': 'troops/Icon_HV_P.E.K.K.A.png',
      'Baby Dragon': 'troops/Icon_HV_Baby_Dragon.png',
      'Miner': 'icons//Super_Miner.png',
      'Electro Dragon': 'troops/Icon_HV_Electro_Dragon.png',
      'Yeti': 'troops/Icon_HV_Yeti.png',
      'Dragon Rider': 'troops/Icon_HV_Dragon_Rider.png',
      'Electro Titan': 'troops/Icon_HV_Electro_Titan.png',
      'Minion': 'troops/Icon_HV_Minion.png',
      'Hog Rider': 'icons/Icon_HV_Hog_Rider.png',
      'Valkyrie': 'troops/Icon_HV_Valkyrie.png',
      'Golem': 'troops/Icon_HV_Golem.png',
      'Witch': 'troops/Icon_HV_Witch.png',
      'Bowler': 'troops/Icon_HV_Bowler.png',
      'Ice Golem': 'troops/Icon_HV_Ice_Golem.png',
      'Lava Hound': 'troops/Icon_HV_Lava_Hound.png',
      'Headhunter': 'troops/Icon_HV_Headhunter.png',
      'Apprentice Warden': 'troops/Icon_HV_Apprentice_Warden.png',
      'Root Rider': 'troops/Icon_HV_Root_Rider.png',
      'Thrower': 'troops/Icon_HV_Thrower.png',
      'Druid': 'troops/Icon_HV_Druid.png',
      'Furnace': 'troops/Icon_HV_Furnace.png'
    },
    heroes: {
      'Barbarian King': 'heroes/Icon_HV_Hero_Barbarian_King.png',
      'Archer Queen': 'heroes/Icon_HV_Hero_Archer_Queen.png',
      'Grand Warden': 'heroes/Icon_HV_Hero_Grand_Warden.png',
      'Royal Champion': 'heroes/Icon_HV_Hero_Royal_Champion.png',
      'Minion Prince': 'heroes/Icon_HV_Hero_Minion_Prince.png'
    },
    pets: {
      'L.A.S.S.I': 'pets/Icon_HV_Hero_Pets_L.A.S.S.I.png',
      'Mighty Yak': 'pets/Icon_HV_Hero_Pets_Mighty_Yak.png',
      'Electro Owl': 'pets/Icon_HV_Hero_Pets_Electro_Owl.png',
      'Unicorn': 'pets/Icon_HV_Hero_Pets_Unicorn.png',
      'Phoenix': 'pets/Icon_HV_Hero_Pets_Phoenix.png',
      'Diggy': 'pets/Icon_HV_Hero_Pets_Diggy.png',
      'Frosty': 'pets/Icon_HV_Hero_Pets_Frosty.png',
      'Poison Lizard': 'pets/Icon_HV_Hero_Pets_Poison_Lizard.png',
      'Spirit Fox': 'pets/Icon_HV_Hero_Pets_Spirit_Fox.png',
      'Angry Jelly': 'pets/Icon_HV_Hero_Pets_Angry_Jelly.png',
      'Sneezy': 'pets/Icon_HV_Hero_Pets_Sneezy.png'
    },
    equipment: {
      'Barbarian Puppet': 'equipment/Hero_Equipment_BK_Barbarian_Puppet.png',
      'Earthquake Boots': 'equipment/Hero_Equipment_BK_Earthquake_Boots.png',
      'Giant Gauntlet': 'equipment/Hero_Equipment_BK_Giant_Gauntlet.png',
      'Rage Vial': 'equipment/Hero_Equipment_BK_Rage_Vial.png',
      'Snake Bracelet': 'equipment/Hero_Equipment_BK_Snake_Bracelet.png',
      'Spiky Ball': 'equipment/Hero_Equipment_BK_Spiky_Ball.png',
      'Vampstache': 'equipment/Hero_Equipment_BK_Vampstache.png',
      'Archer Puppet': 'equipment/Hero_Equipment_AQ_Archer_Puppet.png',
      'Frozen Arrow': 'equipment/Hero_Equipment_AQ_Frozen_Arrow.png',
      'Giant Arrow': 'equipment/Hero_Equipment_AQ_Giant_Arrow.png',
      'Healer Puppet': 'equipment/Hero_Equipment_AQ_Healer_Puppet.png',
      'Invisibility Vial': 'equipment/Hero_Equipment_AQ_Invisibility_Vial.png',
      'Magic Mirror': 'equipment/Hero_Equipment_AQ_Magic_Mirror.png',
      'WWEActionFigure': 'equipment/Hero_Equipment_AQ_WWEActionFigure.png',
      'Eternal Tome': 'equipment/Hero_Equipment_GW_Eternal_Tome.png',
      'Fireball': 'equipment/Hero_Equipment_GW_Fireball.png',
      'Healing Tome': 'equipment/Hero_Equipment_GW_Healing_Tome.png',
      'LavaLoon Puppet': 'equipment/Hero_Equipment_GW_Lavaloon_Puppet.png',
      'Life Gem': 'equipment/Hero_Equipment_GW_Life_Gem.png',
      'Rage Gem': 'equipment/Hero_Equipment_GW_Rage_Gem.png',
      'Electro Boots': 'equipment/Hero_Equipment_RC_Electro_Boots.png',
      'Haste Vial': 'equipment/Hero_Equipment_RC_Haste_Vial.png',
      'Hog Rider Doll': 'equipment/Hero_Equipment_RC_Hog_Rider_Doll.png',
      'Rocket Spear': 'equipment/Hero_Equipment_RC_Rocket_Spear.png',
      'Royal Gem': 'equipment/Hero_Equipment_RC_Royal_Gem.png',
      'Seeking Shield': 'equipment/Hero_Equipment_RC_Seeking_Shield.png',
      'Dark Crown': 'equipment/Hero_Equipment_MP_Dark_Crown.png',
      'Dark Orb': 'equipment/Hero_Equipment_MP_Dark_Orb.png',
      'Henchman': 'equipment/Hero_Equipment_MP_Henchman.png',
      'Heroic Torch': 'equipment/Hero_Equipment_MP_Heroic_Torch.png',
      'Metal Pants': 'equipment/Hero_Equipment_MP_Metal_Pants.png',
      'Noble Iron': 'equipment/Hero_Equipment_MP_Noble_Iron.png'
    },
    spells: {

      'Lightning': 'spells/Icon_HV_Spell_Lightning.png',
      'Rage': 'spells/Icon_HV_Spell_Rage.png',
      'Heal': 'spells/Icon_HV_Spell_Heal.png',
      'Jump': 'spells/Icon_HV_Spell_Jump.png',
      'Freeze': 'spells/Icon_HV_Spell_Freeze.png',
      'Invisibility': 'spells/Icon_HV_Spell_Invisibility.png',
      'Clone': 'spells/Icon_HV_Spell_Clone.png',
      'Recall': 'spells/Icon_HV_Spell_Recall.png',
      'Hero Revive Potion': 'spells/Icon_HV_Spell_Hero_Revive_Potion.png',
      'Poison': 'spells/Icon_HV_Dark_Spell_Poison.png',
      'Haste': 'spells/Icon_HV_Dark_Spell_Haste.png',
      'Bat': 'spells/Icon_HV_Dark_Spell_Bat.png',
      'Skeleton': 'spells/Icon_HV_Dark_Spell_Skeleton.png',
      'Earthquake': 'spells/Icon_HV_Dark_Spell_Earthquake.png',
      'Overgrowth': 'spells/Icon_HV_Dark_Spell_Overgrowth.png'
    },
    siege: {
      'Wall Wrecker': 'siege/Icon_HV_Siege_Machine_Wall_Wrecker.png',
      'Battle Blimp': 'siege/Icon_HV_Siege_Machine_Battle_Blimp.png',
      'Stone Slammer': 'siege/Icon_HV_Siege_Machine_Stone_Slammer.png',
      'Siege Barracks': 'siege/Icon_HV_Siege_Machine_Siege_Barracks.png',
      'Log Launcher': 'siege/Icon_HV_Siege_Machine_Log_Launcher.png',
      'Flame Flinger': 'siege/Icon_HV_Siege_Machine_Flame_Flinger.png',
      'Battle Drill': 'siege/Icon_HV_Siege_Machine_Battle_Drill.png',
      'Troop Launcher': 'siege/Icon_HV_Siege_Machine_Troop_Launcher.png'
    }
  },
  builder: {
    troops: {
      'Raged Barbarian': 'bb-troops/Icon_BB_Raged_Barbarian.png',
      'Sneaky Archer': 'bb-troops/Icon_BB_Sneaky_Archer.png',
      'Boxer Giant': 'bb-troops/Icon_BB_Boxer_Giant.png',
      'Beta Minion': 'bb-troops/Icon_BB_Beta_Minion.png',
      'Bomber': 'bb-troops/Icon_BB_Bomber.png',
      'Baby Dragon': 'bb-troops/Icon_BB_Baby_Dragon.png',
      'Cannon Cart': 'bb-troops/Icon_BB_Cannon_Cart.png',
      'Night Witch': 'bb-troops/Icon_BB_Night_Witch.png',
      'Drop Ship': 'bb-troops/Icon_BB_Drop_Ship.png',
      'Power P.E.K.K.A': 'bb-troops/Icon_BB_Power_P.E.K.K.A.png',
      'Hog Glider': 'bb-troops/Icon_BB_Hog_Glider.png',
      'Electrofire Wizard': 'bb-troops/Icon_BB_Electrofire_Wizard.png'
    },
    heroes: {
      'Battle Machine': 'bb-heroes/Icon_BB_Hero_Battle_Machine.png',
      'Battle Copter': 'bb-heroes/Icon_BB_Hero_Battle_Copter.png'
    }
  }
};
const PET_NAMES = new Set(Object.keys(ICONS.home.pets));
const SIEGE_NAMES = new Set(Object.keys(ICONS.home.siege));
const BUILDER_HERO_NAMES = new Set([
  "Battle Machine",
  "Battle Copter",
]);

const SYNONYMS = {
  'home:troops': {
    'Super Miner': 'Miner',
    'Super Hog Rider': 'Hog Rider',
    'Super Yeti': 'Yeti'
  },
  'builder:troops': {
    'Super P.E.K.K.A': 'Power P.E.K.K.A'
  },
  'home:spells': {
    'Revive': 'Hero Revive Potion',
    'Revive Potion': 'Hero Revive Potion',
    'Ice Block': 'Freeze'
  },
  'home:equipment': {
    'Henchmen Puppet': 'Henchman',
    'Hog Rider Puppet': 'Hog Rider Doll',
    'HogRider Puppet': 'Hog Rider Doll',
    'Action Figure': 'WWEActionFigure',
    'WWE Action Figure': 'WWEActionFigure'
  }
};

const EQUIPMENT_HERO_MAP = {
  'Barbarian Puppet': 'Barbarian King',
  'Earthquake Boots': 'Barbarian King',
  'Giant Gauntlet': 'Barbarian King',
  'Rage Vial': 'Barbarian King',
  'Snake Bracelet': 'Barbarian King',
  'Spiky Ball': 'Barbarian King',
  'Vampstache': 'Barbarian King',
  'Archer Puppet': 'Archer Queen',
  'Frozen Arrow': 'Archer Queen',
  'Giant Arrow': 'Archer Queen',
  'Healer Puppet': 'Archer Queen',
  'Invisibility Vial': 'Archer Queen',
  'Magic Mirror': 'Archer Queen',
  'WWEActionFigure': 'Archer Queen',
  'Eternal Tome': 'Grand Warden',
  'Fireball': 'Grand Warden',
  'Healing Tome': 'Grand Warden',
  'LavaLoon Puppet': 'Grand Warden',
  'Life Gem': 'Grand Warden',
  'Rage Gem': 'Grand Warden',
  'Electro Boots': 'Royal Champion',
  'Haste Vial': 'Royal Champion',
  'Hog Rider Doll': 'Royal Champion',
  'Rocket Spear': 'Royal Champion',
  'Royal Gem': 'Royal Champion',
  'Seeking Shield': 'Royal Champion',
  'Dark Crown': 'Minion Prince',
  'Dark Orb': 'Minion Prince',
  'Henchman': 'Minion Prince',
  'Heroic Torch': 'Minion Prince',
  'Metal Pants': 'Minion Prince',
  'Noble Iron': 'Minion Prince'
};

const HERO_ORDER = [
  'Barbarian King',
  'Archer Queen',
  'Grand Warden',
  'Royal Champion',
  'Minion Prince',
];

const decodeName = (value) => {
  if (!value) return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value.replace(/%20/g, ' ');
  }
};

const ICON_OVERRIDES = {
  "power p.e.k.k.a": [
    "bb-troops/Icon_BB_Power_P.E.K.K.A.png",
    "troops/Icon_HV_P.E.K.K.A.png",
  ],
  "p.e.k.k.a": [
    "troops/Icon_HV_P.E.K.K.A.png",
    "troops/P.E.K.K.A.png",
  ],
  "super yeti": [
    "super-troop-pics/Icon_HV_Super_Yeti.png",
    "troops/Super_Yeti.png",
  ],
  "troop launcher": [
    "siege/Icon_HV_Siege_Machine_Troop_Launcher.png",
    "siege/icon_troop_launcher.png",
  ],
  "overgrowth spell": [
    "spells/Icon_HV_Dark_Spell_Overgrowth.png",
  ],
  "ice block spell": [
    "spells/Icon_HV_Spell_Ice_Block.png",
    "/assets/coc/icons/spells/Icon_HV_Dark_Spell_Revive_Spell.png/Ice_Block_Spell.png",
  ],
  "minion prince": [
    "heroes/Icon_HV_Hero_Minion_Prince.png",
    "equipment/Hero_Equipment_RC_Minion_Prince.png",
    "https://api-assets.clashofclans.com/equipment/512/Hero_Equipment_RC_Minion_Prince.png",
  ],
};

const applyBasePath = (entry) => {
  if (!entry) return "";
  const trimmed = entry.replace(/^\/+/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return entry;
  }
  return `${ICON_BASE_PATH}/${trimmed}`;
};



const pickIcon = (iconUrls) => {
  if (!iconUrls) return "";
  return iconUrls.medium || iconUrls.large || iconUrls.small || iconUrls.tiny || "";
};

const sanitizeNameForIcon = (value = "") =>
  value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w._-]+/g, "_")
    .replace(/_+/g, "_");

const distinct = (values) => Array.from(new Set(values.filter(Boolean)));

const capitalizeParts = (value) =>
  value
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("_");

const buildFileNameVariants = (name) => {
  if (!name) return [];
  const cleaned = name.replace(/^\/+/, "");
  const hasExt = /\.[^.]+$/.test(cleaned);
  const ext = hasExt ? cleaned.slice(cleaned.lastIndexOf(".")) : "";
  const base = hasExt ? cleaned.slice(0, -ext.length) : cleaned;

  const baseVariants = distinct([
    base,
    base.replace(/_/g, ""),
    base.replace(/_/g, "-"),
    base.toLowerCase(),
    base.toUpperCase(),
    capitalizeParts(base),
  ]);

  const extensions = hasExt ? [ext] : [".png"];
  const prefixes = [
    "",
    "Icon_",
    "Icon_HV_",
    "Icon_BB_",
    "Troop_HV_",
    "Troop_BB_",
    "Spell_",
    "icon_",
    "Hero_Equipment_",
    "HeroGear_",
    "Super_Troop_",
  ];

  const variants = [];
  baseVariants.forEach((variant) => {
    extensions.forEach((extension) => {
      const fileName = `${variant}${extension}`;
      prefixes.forEach((prefix) => {
        variants.push(`${prefix}${variant}${extension}`);
      });
      variants.push(fileName);
    });
  });

  return distinct(variants);
};

const buildIconCandidates = (category, item) => {
  const localDirs = ICON_DIRS[category] || [];
  const candidates = [];

  const pushLocal = (value) => {
    const resolved = applyBasePath(value);
    if (resolved) {
      candidates.push(resolved);
    }
  };

  const rawName = item?.name || "";
  const decodedName = decodeName(rawName);
  let normalizedName = decodedName;
  if (category === "spells") normalizedName = spellSynonym(decodedName);
  if (category === "equipment") normalizedName = equipmentSynonym(decodedName);

  const nameLower = normalizedName.toLowerCase();
  const override = ICON_OVERRIDES[nameLower];
  if (override && override.length) {
    override.forEach(pushLocal);
  }

  const villageKey = (item?.village || "home").toLowerCase().includes("builder") ? "builder" : "home";
  let mappingCategory = category;
  if (category === "troops") {
    if (PET_NAMES.has(rawName) || PET_NAMES.has(normalizedName)) mappingCategory = "pets";
    else if (SIEGE_NAMES.has(rawName) || SIEGE_NAMES.has(normalizedName)) mappingCategory = "siege";
    else mappingCategory = "troops";
  }
  const mapped =
    ICONS[villageKey]?.[mappingCategory]?.[normalizedName] ||
    ICONS[villageKey]?.[mappingCategory]?.[decodedName] ||
    ICONS[villageKey]?.[mappingCategory]?.[rawName];
  if (mapped) {
    pushLocal(mapped);
  }
  const synKey = `${villageKey}:${mappingCategory}`;
  const aliasMap = SYNONYMS[synKey] || {};
  const alias = aliasMap[normalizedName] || aliasMap[decodedName] || aliasMap[rawName];
  if (alias) {
    const mappedAlias = ICONS[villageKey]?.[mappingCategory]?.[alias];
    if (mappedAlias) pushLocal(mappedAlias);
  }

  const sanitized = sanitizeNameForIcon(normalizedName);
  const remoteIcon = pickIcon(item?.iconUrls);

  const remoteFileName = remoteIcon
    ? decodeURIComponent(remoteIcon.split("/").pop()?.split("?")[0] || "")
    : "";

  const nameVariants = distinct([
    normalizedName,
    normalizedName.replace(/\s+/g, "_"),
    sanitized,
    sanitized.replace(/_/g, ""),
    remoteFileName,
    remoteFileName.replace(/\.[^.]+$/, ""),
  ]);

  const fileNames = distinct(
    nameVariants.flatMap((variant) => {
      if (!variant) return [];
      return buildFileNameVariants(variant);
    })
  );

  fileNames.forEach((fileName) => {
    const cleaned = fileName.replace(/^\/+/, "");
    localDirs.forEach((dir) => pushLocal(`${dir}/${cleaned}`));
    pushLocal(cleaned);
  });

  if (category === "troops") {
    if (villageKey === "home") {
      const slug = sanitized;
      const slugNoDots = slug.replace(/\./g, "");
      pushLocal(`troops/Icon_HV_${slug}.png`);
      pushLocal(`troops/Icon_HV_${slugNoDots}.png`);
      pushLocal(`troops/Troop_HV_${slug}_grass.png`);
      pushLocal(`${slug}.png`);
    } else {
      const slug = sanitized;
      pushLocal(`bb-troops/Icon_BB_${slug}.png`);
    }
  }

  if (category === "heroes") {
    const slug = sanitized;
    if (villageKey === "home") {
      pushLocal(`heroes/Icon_HV_Hero_${slug}.png`);
    } else {
      pushLocal(`bb-heroes/Icon_BB_Hero_${slug}.png`);
    }
  }

  if (category === "spells") {
    const slug = sanitized.replace(/^Healing$/i, "Heal");
    pushLocal(`spells/Icon_HV_Spell_${slug}.png`);
    pushLocal(`spells/Icon_HV_Dark_Spell_${slug}.png`);
  }

  if (category === "pets") {
    const slug = sanitized;
    pushLocal(`pets/Icon_HV_Hero_Pets_${slug}.png`);
  }

  if (category === "siege") {
    const slug = sanitized;
    pushLocal(`siege/Icon_HV_Siege_Machine_${slug}.png`);
    pushLocal(`siege/${slug.toLowerCase()}.png`);
  }

  if (category === "equipment") {
    const slug = sanitized;
    const heroes = ["AQ", "BK", "GW", "RC", "MP"];
    heroes.forEach((code) => pushLocal(`equipment/Hero_Equipment_${code}_${slug}.png`));
    pushLocal(`equipment/${slug}.png`);
  }

  if (remoteIcon) {
    candidates.push(remoteIcon);
  }

  return distinct(candidates);
};

const describeLevel = (item) => {
  const current = item.level ?? item.stars;
  const max = item.maxLevel ?? item.maxStars;
  if (current === undefined || current === null) return "--";
  if (max) {
    return `${current}/${max}`;
  }
  return `${current}`;
};

const UnitCard = ({ item, category }) => {
  const candidates = useMemo(() => buildIconCandidates(category, item), [category, item]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [candidates.join("|")]);

  const src = candidates[index] || "";

  return (
    <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-slate-900/70 p-3 shadow-inner">
      {src ? (
        <img
          src={src}
          alt={item.name}
          className="h-16 w-16 rounded-xl object-contain"
          onError={() => {
            setIndex((prev) => (prev + 1 < candidates.length ? prev + 1 : prev));
          }}
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-800/70 text-xs text-slate-400">
          No art
        </div>
      )}
      <span className="absolute -bottom-3 rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white shadow">
        {describeLevel(item)}
      </span>
    </div>
  );
};

const UnitRow = ({ title, items, category }) => {
  if (!items || items.length === 0) return null;
  return (
    <section className="space-y-3">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</h4>
      <div className="flex flex-wrap gap-3 rounded-2xl bg-slate-900/70 px-4 py-5">
        {items.map((item) => (
          <UnitCard key={`${item.name}-${item.level ?? item.stars ?? 0}`} item={item} category={category} />
        ))}
      </div>
    </section>
  );
};

const HeroEquipmentSection = ({ groups, other }) => {
  if (!groups.length && !other.length) return null;
  return (
    <section className="space-y-4">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Hero Equipment</h4>
      {groups.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {groups.map((group) => (
            <div
              key={group.hero}
              className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-slate-800/60 shadow-inner"
            >
              <div className="mb-3 flex items-center gap-3">
                {ICONS.home.heroes[group.hero] ? (
                  <img
                    src={applyBasePath(ICONS.home.heroes[group.hero])}
                    alt={group.hero}
                    className="h-8 w-8 rounded-full object-contain"
                  />
                ) : null}
                <p className="text-sm font-semibold text-white">{group.hero}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {group.items.map((item) => (
                  <UnitCard key={`${group.hero}-${item.name}-${item.level}`} item={item} category="equipment" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {other.length ? (
        <div className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-slate-800/60 shadow-inner">
          <p className="mb-3 text-sm font-semibold text-white">Other Equipment</p>
          <div className="flex flex-wrap gap-4">
            {other.map((item) => (
              <UnitCard key={`other-${item.name}-${item.level}`} item={item} category="equipment" />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

const renderStars = (filled = 0, total = 3) => {
  const count = Math.max(total || 0, 0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={index < filled ? "text-yellow-400" : "text-slate-600"}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const AchievementGrid = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl bg-slate-900/70 text-slate-400">
        No achievements to show.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((achievement) => {
        const target = achievement.target || achievement.maxValue || 0;
        const current = achievement.value ?? 0;
        const percent = target ? Math.min((current / target) * 100, 100) : 0;
        const starsEarned = achievement.stars ?? 0;
        const totalStars = achievement.maxStars ?? 3;

        return (
          <div
            key={achievement.name}
            className="flex flex-col gap-4 rounded-2xl bg-slate-900/80 p-6 shadow-inner ring-1 ring-slate-800/60"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">{achievement.name}</p>
                {renderStars(starsEarned, totalStars)}
              </div>
              <p className="text-xs text-slate-400">{achievement.info}</p>
              {achievement.completionInfo ? (
                <p className="text-xs font-medium text-emerald-400">{achievement.completionInfo}</p>
              ) : null}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{current.toLocaleString()} / {target ? target.toLocaleString() : "--"}</span>
              <span>{percent.toFixed(0)}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-700">
              <div className="h-full rounded-full bg-lime-400" style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const buildTroopGroups = (player) => {
  const troops = player?.troops ?? [];
  const heroes = player?.heroes ?? [];

  const homeTroops = troops.filter((unit) => (unit.village || "home") === "home");
  const builderTroops = troops.filter((unit) => (unit.village || "home") === "builderBase");

  const homePets = homeTroops.filter((unit) => PET_NAMES.has(unit.name));
  const homeSiege = homeTroops.filter((unit) => SIEGE_NAMES.has(unit.name));
  const homeSuper = homeTroops.filter((unit) => unit.name?.startsWith('Super ') || unit.superTroopIsActive);
  const homeRegular = homeTroops.filter(
    (unit) => !PET_NAMES.has(unit.name) && !SIEGE_NAMES.has(unit.name) && !homeSuper.includes(unit)
  );

  const builderHeroes = heroes.filter((hero) => BUILDER_HERO_NAMES.has(hero.name));
  const builderRegularHeroes = heroes.filter(
    (hero) => (hero.village || "home") === "builderBase" && !BUILDER_HERO_NAMES.has(hero.name)
  );

  return {
    home: [
      { title: "Troops", items: homeRegular, category: "troops" },
      { title: "Super Troops", items: homeSuper, category: "troops" },
      { title: "Pets", items: homePets, category: "troops" },
      { title: "Siege Machines", items: homeSiege, category: "troops" },
    ].filter((group) => group.items.length > 0),
    builder: [
      { title: "Troops", items: builderTroops, category: "troops" },
      { title: "Builder Heroes", items: builderRegularHeroes, category: "heroes" },
      { title: "Battle Machine", items: builderHeroes, category: "heroes" },
    ].filter((group) => group.items.length > 0),
  };
};

const buildSpellGroups = (player) => {
  const spells = player?.spells ?? [];
  return {
    home: [
      { title: "Spells", items: spells.filter((spell) => (spell.village || "home") === "home"), category: "spells" },
    ].filter((group) => group.items.length > 0),
    builder: [
      { title: "Builder Spells", items: spells.filter((spell) => (spell.village || "home") === "builderBase"), category: "spells" },
    ].filter((group) => group.items.length > 0),
  };
};

const buildHeroGroups = (player) => {
  const heroes = player?.heroes ?? [];
  return {
    home: [
      { title: "Heroes", items: heroes.filter((hero) => (hero.village || "home") === "home"), category: "heroes" },
    ].filter((group) => group.items.length > 0),
    builder: [
      { title: "Builder Heroes", items: heroes.filter((hero) => (hero.village || "home") === "builderBase"), category: "heroes" },
    ].filter((group) => group.items.length > 0),
  };
};

const buildEquipmentGroups = (player) => {
  const equipment = player?.heroEquipment ?? player?.equipment ?? [];
  return {
    home: [
      { title: "Hero Equipment", items: equipment, category: "equipment" },
    ].filter((group) => group.items.length > 0),
  };
};

const buildAchievementGroups = (player) => {
  const achievements = player?.achievements ?? [];
  return {
    home: [
      { title: "Home Village", items: achievements.filter((ach) => ach.village === "home" || ach.village === "homeVillage"), category: "achievements" },
    ].filter((group) => group.items.length > 0),
    builder: [
      { title: "Builder Base", items: achievements.filter((ach) => ach.village === "builderBase"), category: "achievements" },
    ].filter((group) => group.items.length > 0),
  };
};


const spellSynonym = (name) => {
  if (!name) return name;
  if (/^Healing$/i.test(name)) return 'Heal';
  if (/^Skeletons$/i.test(name)) return 'Skeleton';
  if (/^Revive( Potion)?$/i.test(name)) return 'Hero Revive Potion';
  if (/^Ice[ _-]?Block( Spell)?$/i.test(name)) return 'Freeze';
  return name;
};

const equipmentSynonym = (name) => {
  if (!name) return name;
  if (/^Henchmen\s*Puppet$/i.test(name) || /^Henchman\s*Puppet$/i.test(name)) return 'Henchman';
  if (/^Hog\s*Rider\s*Puppet$/i.test(name) || /^HogRider\s*Puppet$/i.test(name)) return 'Hog Rider Doll';
  if (/^(WWE\s*)?Action\s*Figure$/i.test(name) || /^ActionFigure$/i.test(name)) return 'WWEActionFigure';
  if (/^Lava\s*Loon\s*Puppet$/i.test(name)) return 'LavaLoon Puppet';
  if (/^Dark\s*Crown$/i.test(name)) return 'Dark Crown';
  if (/^Dark\s*Orb$/i.test(name)) return 'Dark Orb';
  if (/^Heroic\s*Torch$/i.test(name)) return 'Heroic Torch';
  if (/^Metal\s*Pants$/i.test(name)) return 'Metal Pants';
  if (/^Noble\s*Iron$/i.test(name)) return 'Noble Iron';
  if (/^Rage\s*Gem$/i.test(name)) return 'Rage Gem';
  if (/^Life\s*Gem$/i.test(name)) return 'Life Gem';
  if (/^Electro\s*Boots$/i.test(name)) return 'Electro Boots';
  if (/^Haste\s*Vial$/i.test(name)) return 'Haste Vial';
  if (/^Rocket\s*Spear$/i.test(name)) return 'Rocket Spear';
  if (/^Royal\s*Gem$/i.test(name)) return 'Royal Gem';
  if (/^Seeking\s*Shield$/i.test(name)) return 'Seeking Shield';
  if (/^Giant\s*Gauntlet$/i.test(name)) return 'Giant Gauntlet';
  if (/^Giant\s*Arrow$/i.test(name)) return 'Giant Arrow';
  if (/^Frozen\s*Arrow$/i.test(name)) return 'Frozen Arrow';
  if (/^Healer\s*Puppet$/i.test(name)) return 'Healer Puppet';
  if (/^Archer\s*Puppet$/i.test(name)) return 'Archer Puppet';
  if (/^Barbarian\s*Puppet$/i.test(name)) return 'Barbarian Puppet';
  if (/^Earthquake\s*Boots$/i.test(name)) return 'Earthquake Boots';
  if (/^Snake\s*Bracelet$/i.test(name)) return 'Snake Bracelet';
  if (/^Spiky\s*Ball$/i.test(name)) return 'Spiky Ball';
  if (/^Vampstache$/i.test(name)) return 'Vampstache';
  if (/^Invisibility\s*Vial$/i.test(name)) return 'Invisibility Vial';
  if (/^Magic\s*Mirror$/i.test(name)) return 'Magic Mirror';
  if (/^Eternal\s*Tome$/i.test(name)) return 'Eternal Tome';
  if (/^Healing\s*Tome$/i.test(name)) return 'Healing Tome';
  return name;
};

const buildHeroEquipmentAssignments = (equipment) => {
  const groups = HERO_ORDER.map((hero) => ({ hero, items: [] }));
  const other = [];
  (equipment || []).forEach((item) => {
    const canonical = equipmentSynonym(item?.name || '');
    const hero = EQUIPMENT_HERO_MAP[canonical];
    if (hero) {
      const target = groups.find((group) => group.hero === hero);
      if (target) {
        target.items.push(item);
      }
    } else {
      other.push(item);
    }
  });
  return {
    heroGroups: groups.filter((group) => group.items.length > 0),
    other,
  };
};

const SECTION_BUILDERS = {
  troops: buildTroopGroups,
  spells: buildSpellGroups,
  heroes: buildHeroGroups,
  equipment: buildEquipmentGroups,
  achievements: buildAchievementGroups,
};

export default function PlayerCollections({ player, section }) {
  const buildGroups = SECTION_BUILDERS[section] || (() => ({ home: [], builder: [] }));
  const sectionGroups = useMemo(() => buildGroups(player), [player, buildGroups]);
  const heroEquipmentData = useMemo(() => buildHeroEquipmentAssignments(player?.heroEquipment ?? player?.equipment ?? []), [player]);

  const hasHome = (sectionGroups.home || []).length > 0;
  const hasBuilder = (sectionGroups.builder || []).length > 0;

  const initialVillage = hasHome ? "home" : hasBuilder ? "builder" : "home";
  const [activeVillage, setActiveVillage] = useState(initialVillage);

  useEffect(() => {
    if (activeVillage === "home" && hasHome) return;
    if (activeVillage === "builder" && hasBuilder) return;
    setActiveVillage(hasHome ? "home" : hasBuilder ? "builder" : "home");
  }, [activeVillage, hasHome, hasBuilder]);

  const groupsToRender = activeVillage === "builder" ? sectionGroups.builder : sectionGroups.home;

  if (!groupsToRender || groupsToRender.length === 0) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-3xl bg-slate-950/70 p-12 text-slate-300 shadow-xl">
        No data to display for this section yet.
      </div>
    );
  }

  const renderContent = () => {
    if (section === "achievements") {
      return <AchievementGrid items={groupsToRender.flatMap((group) => group.items)} />;
    }

    if (section === "equipment") {
      if (activeVillage !== "home") {
        return (
          <div className="flex min-h-[200px] items-center justify-center rounded-2xl bg-slate-900/70 p-8 text-slate-300">
            Hero equipment is only available for the Home Village.
          </div>
        );
      }
      return (
        <HeroEquipmentSection
          groups={heroEquipmentData.heroGroups}
          other={heroEquipmentData.other}
        />
      );
    }

    const rows = groupsToRender.map((group) => (
      <UnitRow
        key={group.title}
        title={group.title}
        items={group.items}
        category={group.category}
      />
    ));

    if (section === "heroes" && activeVillage === "home") {
      rows.push(
        <HeroEquipmentSection
          key="hero-equipment"
          groups={heroEquipmentData.heroGroups}
          other={heroEquipmentData.other}
        />
      );
    }

    return rows;
  };

  return (
    <div className="space-y-8">
      {hasHome && hasBuilder ? (
        <div className="flex items-center justify-center gap-3">
          {hasHome ? (
            <button
              type="button"
              onClick={() => setActiveVillage("home")}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activeVillage === "home"
                  ? "bg-sky-500 text-white shadow"
                  : "bg-slate-800/70 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Home Village
            </button>
          ) : null}
          {hasBuilder ? (
            <button
              type="button"
              onClick={() => setActiveVillage("builder")}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activeVillage === "builder"
                  ? "bg-sky-500 text-white shadow"
                  : "bg-slate-800/70 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Builder Base
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-10">{renderContent()}</div>
    </div>
  );
}
