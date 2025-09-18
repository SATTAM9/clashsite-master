import { useEffect, useMemo, useState } from "react";
import "./XpCalculator.css";

const TEXT = {
  appTitle: "Clash of Clans XP Calculator - Enhanced",
  range: (min, max) => `Supported levels: ${min}-${max}`,
  share: "Share",
  reset: "Reset",
  currentLevel: (min, max) => `Your current level (${min}-${max})`,
  targetLevel: (min, max) => `Target level (${min}-${max})`,
  xpRequired: "XP to next level",
  totalAtLevel: "Total XP at level",
  betweenTwoLevels: "XP between two levels",
  fromLevel: (min, max) => `From level (${min}-${max})`,
  toLevel: (min, max) => `To level (${min}-${max})`,
  builderXpFromTime: "Builder XP from upgrade time",
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
  enableBoost: "Enable time reduction (e.g. Gold Pass)",
  boostPct: "Reduction %",
  appliesBeforeSqrt: "Reduction applies before square root.",
  originalSeconds: "Original seconds",
  reducedSeconds: "Seconds after reduction",
  builderXp: "Builder XP",
  planToTarget: "Plan to reach target level",
  xpDaily: "Expected daily XP",
  totalAtTarget: "Total XP at target",
  currentXpAt: (lvl) => `Current XP at level ${lvl}`,
  remainingXp: "Remaining XP",
  approxDuration: "Approximate duration",
  approxNote: "* Estimate based on your daily XP; adjust as needed.",
  wikiRanges: "XP ranges per level (per community wiki)",
  lvl12: "Level 1 -> 2: ",
  lvl2to200: "Levels 2-200: 50 x (level - 1) per upgrade.",
  lvl201to299: "Levels 201-299: 500 x (level - 200) + 9500 per upgrade.",
  lvl300p: "Levels 300+: 1000 x (level - 300) + 60000 per upgrade.",
  copied: "Link copied with settings.",
  copyManually: "Copy link manually:",
  footer: "Unofficial fan-made tool for Clash of Clans",
};

const MIN_LEVEL = 1;
const MAX_LEVEL = 500;

const DEFAULT_STATE = {
  level: 100,
  target: 200,
  from: 87,
  to: 120,
  days: 0,
  hours: 1,
  minutes: 0,
  seconds: 0,
  boostOn: true,
  boostPct: 20,
  xpPerDay: 2500,
};

function clampLevel(value) {
  const numeric = Math.floor(Number(value));
  if (!Number.isFinite(numeric)) return MIN_LEVEL;
  if (numeric < MIN_LEVEL) return MIN_LEVEL;
  if (numeric > MAX_LEVEL) return MAX_LEVEL;
  return numeric;
}

function xpToNextLevel(level) {
  const current = clampLevel(level);
  if (current <= 0 || !Number.isFinite(current)) return 0;
  if (current === 1) return 30;
  if (current >= 2 && current <= 200) return 50 * (current - 1);
  if (current >= 201 && current <= 299) {
    return 500 * (current - 200) + 9500;
  }
  return 1000 * (current - 300) + 60000;
}

function totalXpAtLevel(level) {
  const current = clampLevel(level);
  if (!Number.isFinite(current) || current <= 1) return 0;
  let sum = 0;
  for (let l = 1; l < Math.floor(current); l += 1) {
    sum += xpToNextLevel(l);
  }
  return sum;
}

function betweenLevelsXP(fromLevel, toLevel) {
  const from = clampLevel(fromLevel);
  const to = clampLevel(toLevel);
  if (to <= from) return 0;
  return totalXpAtLevel(to) - totalXpAtLevel(from);
}

function applyTimeReduction(secondsTotal, percent) {
  const pct = Math.min(90, Math.max(0, Number(percent) || 0));
  const reduced = Math.floor(secondsTotal * (1 - pct / 100));
  return Math.max(0, reduced);
}

function usePersistedState(key, initial) {
  const initializer = () => {
    try {
      const urlSearch = new URLSearchParams(window.location.search);
      const entries = Object.fromEntries(urlSearch.entries());
      if (Object.keys(entries).length > 0) {
        const parsed = { ...initial };
        for (const [k, rawValue] of Object.entries(entries)) {
          if (!(k in parsed)) continue;
          let value = rawValue;
          if (value === "true") value = true;
          else if (value === "false") value = false;
          else if (!Number.isNaN(Number(value)) && value.trim() !== "") {
            value = Number(value);
          }
          parsed[k] = value;
        }
        return parsed;
      }
      const stored = localStorage.getItem(key);
      if (stored) {
        return { ...initial, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error("Failed to load persisted state", error);
    }
    return initial;
  };

  const [state, setState] = useState(initializer);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to persist state", error);
    }
  }, [key, state]);

  return [state, setState];
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="text-slate-200 font-medium">{label}</span>
      {children}
    </label>
  );
}

function NumberInput({ value, onChange, min = 0, max, step = 1, placeholder }) {
  const handleChange = (event) => {
    const raw = Number(event.target.value);
    let nextValue = Number.isFinite(raw) ? raw : min ?? 0;
    if (typeof min === "number") nextValue = Math.max(min, nextValue);
    if (typeof max === "number") nextValue = Math.min(max, nextValue);
    onChange(nextValue);
  };

  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      value={Number.isFinite(value) ? value : 0}
      onChange={handleChange}
      className="h-11 px-3 rounded-xl border border-white/10 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  );
}

const CARD_BACKGROUNDS = {
  next: "xp-card-bg-next",
  total: "xp-card-bg-total",
  between: "xp-card-bg-between",
  build: "xp-card-bg-build",
};

function Card({ title, children, bgKey }) {
  const bgClass = CARD_BACKGROUNDS[bgKey];
  return (
    <div className={`xp-card relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/70 p-6 backdrop-blur-sm shadow-lg flex flex-col gap-5 ${bgClass ?? ""}`}>
      {bgClass ? <div className="xp-card-overlay" /> : null}
      <div className="relative z-10 text-lg font-semibold tracking-wide text-yellow-300">{title}</div>
      <div className="relative z-10 grid gap-4 text-sm text-slate-100">{children}</div>
    </div>
  );
}

function formatDuration(totalDays) {
  if (!Number.isFinite(totalDays) || totalDays <= 0) {
    return "0 days";
  }

  const days = Math.floor(totalDays);
  const hours = Math.floor((totalDays - days) * 24);
  const minutes = Math.floor(((totalDays - days) * 24 - hours) * 60);

  const parts = [];
  if (days) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  return parts.join(", ") || "0 days";
}

function XpCalculator() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  const [state, setState] = usePersistedState(
    "coc_xp_calculator_state_csp_v1",
    DEFAULT_STATE,
  );

  const nextXp = useMemo(() => xpToNextLevel(state.level), [state.level]);
  const totalXp = useMemo(() => totalXpAtLevel(state.target), [state.target]);
  const betweenXp = useMemo(
    () => betweenLevelsXP(state.from, state.to),
    [state.from, state.to],
  );

  const rawSeconds = useMemo(
    () =>
      (state.days || 0) * 86400 +
      (state.hours || 0) * 3600 +
      (state.minutes || 0) * 60 +
      (state.seconds || 0),
    [state.days, state.hours, state.minutes, state.seconds],
  );

  const effectiveSeconds = useMemo(
    () => (state.boostOn ? applyTimeReduction(rawSeconds, state.boostPct) : rawSeconds),
    [rawSeconds, state.boostOn, state.boostPct],
  );

  const builderXp = useMemo(
    () => Math.floor(Math.sqrt(effectiveSeconds)),
    [effectiveSeconds],
  );

  const needToTarget = useMemo(
    () => Math.max(0, totalXp - totalXpAtLevel(state.level)),
    [state.level, totalXp],
  );

  const daysToTarget = useMemo(
    () =>
      !state.xpPerDay || state.xpPerDay <= 0
        ? Infinity
        : needToTarget / state.xpPerDay,
    [needToTarget, state.xpPerDay],
  );

  const formatNumber = (value) => Number(value).toLocaleString("en");

  const handleShare = async () => {
    const params = new URLSearchParams();
    Object.entries(state).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(url);
      window.alert(TEXT.copied);
    } catch (error) {
      console.warn("Clipboard write failed", error);
      window.prompt(TEXT.copyManually, url);
    }
  };

  const resetAll = () => setState(DEFAULT_STATE);
  const updateState = (patch) => setState((prev) => ({ ...prev, ...patch }));

  return (
    <div className="xp-calculator min-h-screen bg-gradient-to-r from-[#384f84] via-[#1e293b] to-[#15203a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-yellow-300 drop-shadow">
              {TEXT.appTitle}
            </h1>
            <p className="text-sm text-slate-200/80">
              {TEXT.range(MIN_LEVEL, MAX_LEVEL)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold shadow hover:bg-yellow-300 transition"
            >
              {TEXT.share}
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
            >
              {TEXT.reset}
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title={TEXT.xpRequired} bgKey="next">
            <Field label={TEXT.currentLevel(MIN_LEVEL, MAX_LEVEL)}>
              <NumberInput
                value={state.level}
                onChange={(value) => updateState({ level: clampLevel(value) })}
                min={MIN_LEVEL}
                max={MAX_LEVEL}
              />
            </Field>
            <div className="text-2xl font-semibold text-white">
              {TEXT.xpRequired}: <span className="text-yellow-300">{formatNumber(nextXp)}</span>
            </div>
          </Card>

          <Card title={TEXT.totalAtLevel} bgKey="total">
            <Field label={TEXT.targetLevel(MIN_LEVEL, MAX_LEVEL)}>
              <NumberInput
                value={state.target}
                onChange={(value) => updateState({ target: clampLevel(value) })}
                min={MIN_LEVEL}
                max={MAX_LEVEL}
              />
            </Field>
            <div className="text-2xl font-semibold text-white">
              {TEXT.totalAtLevel}: <span className="text-green-300">{formatNumber(totalXp)}</span>
            </div>
          </Card>

          <Card title={TEXT.betweenTwoLevels} bgKey="between">
            <div className="grid grid-cols-2 gap-4">
              <Field label={TEXT.fromLevel(MIN_LEVEL, MAX_LEVEL)}>
                <NumberInput
                  value={state.from}
                  onChange={(value) => updateState({ from: clampLevel(value) })}
                  min={MIN_LEVEL}
                  max={MAX_LEVEL}
                />
              </Field>
              <Field label={TEXT.toLevel(MIN_LEVEL, MAX_LEVEL)}>
                <NumberInput
                  value={state.to}
                  onChange={(value) => updateState({ to: clampLevel(value) })}
                  min={MIN_LEVEL}
                  max={MAX_LEVEL}
                />
              </Field>
            </div>
            <div className="text-2xl font-semibold text-white">
              {TEXT.betweenTwoLevels}: <span className="text-sky-300">{formatNumber(betweenXp)}</span>
            </div>
          </Card>

          <Card title={TEXT.builderXpFromTime} bgKey="build">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label={TEXT.days}>
                <NumberInput
                  value={state.days}
                  onChange={(value) => updateState({ days: Math.max(0, value) })}
                  min={0}
                />
              </Field>
              <Field label={TEXT.hours}>
                <NumberInput
                  value={state.hours}
                  onChange={(value) => updateState({ hours: Math.max(0, value) })}
                  min={0}
                />
              </Field>
              <Field label={TEXT.minutes}>
                <NumberInput
                  value={state.minutes}
                  onChange={(value) => updateState({ minutes: Math.max(0, value) })}
                  min={0}
                />
              </Field>
              <Field label={TEXT.seconds}>
                <NumberInput
                  value={state.seconds}
                  onChange={(value) => updateState({ seconds: Math.max(0, value) })}
                  min={0}
                />
              </Field>
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-4 items-start">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={state.boostOn}
                  onChange={(event) => updateState({ boostOn: event.target.checked })}
                  className="size-4 rounded border-white/30 bg-gray-900/70 text-yellow-400 focus:ring-yellow-400"
                />
                {TEXT.enableBoost}
              </label>
              <Field label={TEXT.boostPct}>
                <NumberInput
                  value={state.boostPct}
                  onChange={(value) => updateState({ boostPct: Math.min(90, Math.max(0, value)) })}
                  min={0}
                  max={90}
                />
              </Field>
              <div className="text-xs text-slate-300/80">
                {TEXT.appliesBeforeSqrt}
              </div>
            </div>

            <div className="mt-4 text-sm grid gap-1 text-slate-200">
              <div>
                {TEXT.originalSeconds}: <b className="text-white">{formatNumber(rawSeconds)}</b>
              </div>
              <div>
                {TEXT.reducedSeconds}: <b className="text-white">{formatNumber(effectiveSeconds)}</b>
              </div>
              <div>
                {TEXT.builderXp}: <b className="text-white">{formatNumber(builderXp)}</b>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title={TEXT.planToTarget}>
            <div className="grid md:grid-cols-3 gap-4">
              <Field label={TEXT.currentLevel(MIN_LEVEL, MAX_LEVEL)}>
                <NumberInput
                  value={state.level}
                  onChange={(value) => updateState({ level: clampLevel(value) })}
                  min={MIN_LEVEL}
                  max={MAX_LEVEL}
                />
              </Field>
              <Field label={TEXT.targetLevel(MIN_LEVEL, MAX_LEVEL)}>
                <NumberInput
                  value={state.target}
                  onChange={(value) => updateState({ target: clampLevel(value) })}
                  min={MIN_LEVEL}
                  max={MAX_LEVEL}
                />
              </Field>
              <Field label={TEXT.xpDaily}>
                <NumberInput
                  value={state.xpPerDay}
                  onChange={(value) => updateState({ xpPerDay: Math.max(0, value) })}
                  min={0}
                  step={100}
                />
              </Field>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-200/90 mt-3">
              <div>
                {TEXT.totalAtTarget}: <b className="text-white">{formatNumber(totalXp)}</b>
              </div>
              <div>
                {TEXT.currentXpAt(state.level)}: <b className="text-white">{formatNumber(totalXpAtLevel(state.level))}</b>
              </div>
              <div>
                {TEXT.remainingXp}: <b className="text-white">{formatNumber(needToTarget)}</b>
              </div>
            </div>
            <div className="mt-4 text-xl font-semibold text-white">
              {TEXT.approxDuration}: {Number.isFinite(daysToTarget) ? formatDuration(Math.ceil(daysToTarget)) : "-"}
            </div>
            <div className="text-xs text-slate-200/70 mt-2">{TEXT.approxNote}</div>
          </Card>

          <Card title={TEXT.wikiRanges}>
            <ul className="list-disc ps-5 space-y-2 text-sm text-slate-200">
              <li>
                {TEXT.lvl12}
                <b className="text-white">30 XP</b>.
              </li>
              <li>{TEXT.lvl2to200}</li>
              <li>{TEXT.lvl201to299}</li>
              <li>{TEXT.lvl300p}</li>
            </ul>
          </Card>
        </div>

        <footer className="pt-4 text-center text-xs text-slate-200/70">
          Copyright {new Date().getFullYear()} - {TEXT.footer}
        </footer>
      </div>
    </div>
  );
}

export default XpCalculator;




