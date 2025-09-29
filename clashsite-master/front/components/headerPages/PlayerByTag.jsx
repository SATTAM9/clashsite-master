import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageShell, { PageSection, SectionHeader } from "../layouts/PageShell";
import PlayerCollections from "../ui/TapPlayer";

export default function PlayerByTag() {
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => setInputValue(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const trimmedTag = inputValue.trim();
    if (!trimmedTag) {
      setError("missing Tag");
      return;
    }

    setSelectedValue(trimmedTag);
  };

  useEffect(() => {
    const getPlayer = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${import.meta.env.VITE_API_URL}/playerbytag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag: selectedValue }),
        });

        const data = await res.json();

        if (data.success && data.playerInfo) {
          setPlayer(data.playerInfo);
        } else {
          setPlayer(null);

          const fallbackMessage = "fetch Failed";
          const normalized =
            data.error === "invalid_tag" ? "missingTag" : fallbackMessage;

          setError(
            typeof data.error === "string" && data.error.trim()
              ? normalized
              : fallbackMessage
          );
        }
      } catch (err) {
        console.error("Error fetching player:", err);
        setPlayer(null);
        setError("fetchFailed");
      } finally {
        setLoading(false);
      }
    };

    if (selectedValue) {
      getPlayer();
    }
  }, [selectedValue]);

  const playerName = player?.name || "Unknown Player";
  const clanName = player?.clan?.name || "No Clan";

  const sectionOrder = [
    "troops",
    "spells",
    "heroes",
    "equipment",
    "achievements",
  ];

  const availableSections = sectionOrder.filter((section) => {
    if (!player) return false;

    if (section === "equipment") {
      const equipment = player.heroEquipment ?? player.equipment;
      return Array.isArray(equipment) && equipment.length > 0;
    }

    const key = section === "achievements" ? "achievements" : section;
    return Array.isArray(player[key]) && player[key].length > 0;
  });

  return (
    <PageShell
      padded
      fullWidth={false}
      variant="plain"
      className="pb-20 text-slate-100"
    >
      <div className="flex flex-col gap-10">
        <PageSection className="space-y-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/h.png"
              loading="lazy"
              alt="Clash emblem"
              className="h-20 w-20 rounded-full border border-white/10 object-cover shadow-lg"
            />
            <SectionHeader
              align="center"
              eyebrow={"search player bytag"}
              title="Find any player by tag"
              description={"search player"}
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className="glass-panel mx-auto flex w-full max-w-4xl flex-col gap-4 border-white/10 bg-slate-950/70 p-6 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                #
              </span>
              <input
                type="text"
                className="w-full rounded-xl border border-white/5 bg-slate-900/80 py-3 pl-10 pr-4 text-base text-white shadow-inner focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                placeholder={"search player"}
                value={inputValue}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-sky-400 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-950 transition hover:bg-sky-300"
            >
              {"search"}
            </button>
          </form>
          <p className="text-xs text-slate-400">
            {"search player"} - Example: #P0LYR8
          </p>
        </PageSection>

        {loading ? (
          <PageSection className="glass-panel flex min-h-[220px] flex-col items-center justify-center gap-4 border-white/5 bg-slate-950/70 text-slate-200">
            <span
              aria-label="Loading"
              className="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-sky-400"
            />
            <span className="text-sm uppercase tracking-[0.3em]">
              {"loading"}
            </span>
          </PageSection>
        ) : null}

        {error && !loading ? (
          <PageSection className="flex flex-col items-center gap-6 text-center">
            <img
              src="/assets/coc/icons/super-troop-pics/Icon_HV_Super_Wall_Breaker.png"
              alt={"search.player.messages.errorTitle"}
              className="h-52 w-auto object-contain opacity-90"
            />
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-rose-300">
                {"search.player.messages.errorTitle"}
              </h2>
              <p className="text-sm text-slate-300">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-rose-400"
            >
              {"try Again"}
            </button>
          </PageSection>
        ) : null}

        {player && !loading ? (
          <>
            <PageSection className="flex flex-col gap-8 text-center md:flex-row md:items-center md:gap-10 md:text-left">
              {player.clan?.badge?.url && (
                <Link
                  to={`/player/${player.tag.replace("#", "")}`}
                  className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 shadow-lg transition hover:scale-105 md:mx-0"
                >
                  <img
                    src={player.clan.badge.url}
                    alt={playerName}
                    className="h-28 w-28 rounded-full object-cover"
                  />
                </Link>
              )}
              <div className={`flex-1 space-y-3 text-center`}>
                <h2 className="text-3xl font-semibold text-white">
                  {playerName}
                </h2>
                <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                      {"player tag"}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-sky-200">
                      {player.tag}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                      {"trophies"}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-amber-200">
                      {player.trophies ?? "-"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                      {"level"}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {player.expLevel ?? "-"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                      {"clan"}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {clanName}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                      {"role"}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {player.role ?? "-"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                      {"donations"}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {player.donations ?? "-"}
                    </p>
                  </div>
                </div>
              </div>
            </PageSection>

            {availableSections.length > 0 && (
              <div className="w-full max-w-6xl mt-10 space-y-10">
                {availableSections.map((section) => (
                  <section
                    key={section}
                    className="rounded-3xl bg-gray-900/80 p-6 shadow-xl"
                  >
                    <div className={`mb-4`}>
                      <h2 className="text-2xl font-bold text-yellow-400">
                        {`player sections  ${section}`}
                      </h2>
                    </div>
                    <PlayerCollections section={section} player={player} />
                  </section>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </PageShell>
  );
}
