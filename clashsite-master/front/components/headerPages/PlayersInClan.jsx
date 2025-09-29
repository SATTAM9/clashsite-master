

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell, { PageSection, SectionHeader } from "../layouts/PageShell";

export default function PlayersInClan() {
  const [inputValue, setInputValue] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [members, setMembers] = useState([]);
  const [clanInfo, setClanInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const handleChange = (event) => setInputValue(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setMembers([]);
    setClanInfo(null);

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError("missing Tag");
      return;
    }

    setSelectedTag(trimmed);
    setSearchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchClanMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/clanbytagForDetails`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag: selectedTag }),
          }
        );

        const data = await res.json();

        if (data.success && data.clanInfo) {
          setClanInfo(data.clanInfo);
          setMembers(
            Array.isArray(data.clanInfo.members) ? data.clanInfo.members : []
          );
        } else {
          setClanInfo(null);
          setMembers([]);
          setError(data.error || "fetchFailed");
        }
      } catch (err) {
        console.error("Error fetching clan members:", err);
        setClanInfo(null);
        setMembers([]);
        setError("fetchFailed");
      } finally {
        setLoading(false);
      }
    };

    if (selectedTag) {
      fetchClanMembers();
    }
  }, [selectedTag, searchTrigger]);

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
              alt="Players in clan"
              className="h-20 w-20 rounded-full border border-white/10 object-cover shadow-lg"
            />
            <SectionHeader
              align="center"
              eyebrow={"search players in clan "}
              title="Find players in clan by tag"
              description={"search players"}
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
                placeholder={"players In Clan"}
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
            {"search players"} - Example: #P0LYR8
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
              alt={"search.players.messages.errorTitle"}
              className="h-52 w-auto object-contain opacity-90"
            />
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-rose-300">
                {"search.players.messages.errorTitle"}
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

        {clanInfo && !loading ? (
          <PageSection className="flex flex-col gap-8 text-center">
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 shadow-lg transition">
              <img
                src={clanInfo.badge?.url}
                alt={clanInfo.name}
                className="h-28 w-28 rounded-full object-cover"
              />
            </div>
            <div className={`flex-1 space-y-3 text-center`}>
              <h2 className="text-3xl font-semibold text-white">
                {clanInfo.name}
              </h2>
              <p className="text-sm text-slate-300">{clanInfo.tag}</p>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-slate-900/80 p-4 ring-1 ring-white/5">
              <h3 className="text-3xl font-bold mb-4">{"Players in Clan"}</h3>
              <table className="min-w-full border-collapse border border-gray-700 rounded-lg">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-700">
                      League
                    </th>
                    <th className="px-4 py-3 border-b border-gray-700">Name</th>
                    <th className="px-4 py-3 border-b border-gray-700">Tag</th>
                    <th className="px-4 py-3 border-b border-gray-700">
                      Level
                    </th>
                    <th className="px-4 py-3 border-b border-gray-700">Role</th>
                    <th className="px-4 py-3 border-b border-gray-700">
                      Trophies
                    </th>
                    <th className="px-4 py-3 border-b border-gray-700">
                      Donations
                    </th>
                    <th className="px-4 py-3 border-b border-gray-700">
                      Received
                    </th>
                    <th className="px-4 py-3 border-b border-gray-700">
                      TownHall
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((player, idx) => {
                    const normalizedTag =
                      typeof player.tag === "string"
                        ? player.tag.replace("#", "")
                        : "";
                    const playerLink = normalizedTag
                      ? `/player/${normalizedTag}`
                      : null;

                    return (
                      <tr
                        key={player.tag || `member-${idx}`}
                        className={`hover:bg-gray-800 transition ${
                          idx % 2 === 0 ? "bg-gray-900" : "bg-gray-700"
                        }`}
                      >
                        <td className="px-4 py-3 border-b border-gray-700">
                          {playerLink ? (
                            <Link to={playerLink}>
                              <img
                                src={player?.league?.icon?.url}
                                alt="league"
                                className="w-10"
                              />
                            </Link>
                          ) : (
                            <img
                              src={player?.league?.icon?.url}
                              alt="league"
                              className="w-10"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-700 font-semibold">
                          {playerLink ? (
                            <Link to={playerLink}>{player.name}</Link>
                          ) : (
                            player.name
                          )}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-700">
                          {player.tag}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-700">
                          {player.expLevel}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-700">
                          {player.role}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-700">
                          {player.trophies}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-700">
                          {player.donations}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-700">
                          {player.received}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-700">
                          {player.townHallLevel}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </PageSection>
        ) : null}
      </div>
    </PageShell>
  );
}
