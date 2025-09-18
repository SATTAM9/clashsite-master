import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../src/i18n/LanguageContext";

const PlayersInClan = () => {
  const { t, direction } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [members, setMembers] = useState([]);
  const [clanInfo, setClanInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => setInputValue(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setMembers([]);
    setClanInfo(null);

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError(t("search.playersInClan.errors.missingTag"));
      return;
    }

    setSelectedTag(trimmed);
  };

  useEffect(() => {
    const fetchClanMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:8081/clanbytagForDetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag: `${selectedTag}` }),
        });

        const data = await res.json();

        if (data.success && data.clanInfo) {
          setClanInfo(data.clanInfo);
          setMembers(Array.isArray(data.clanInfo.members) ? data.clanInfo.members : []);
        } else {
          setClanInfo(null);
          setMembers([]);
          setError(data.error || t("search.playersInClan.errors.fetchFailed"));
        }
      } catch (err) {
        console.error("Error fetching clan members:", err);
        setClanInfo(null);
        setMembers([]);
        setError(t("search.playersInClan.errors.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };

    if (selectedTag) {
      fetchClanMembers();
    }
  }, [selectedTag, t]);

  const tableHeaders = t("search.playersInClan.tableHeaders");

  return (
    <div
      className="min-h-screen bg-gradient-to-r from-[#384f84] via-[#1e293b] to-[#15203a] p-8 text-white flex flex-col items-center"
      dir={direction}
    >
      <img
        src="/icons/super-troop-pics/Super_Troop_Super_Barbarian_grass.png"
        alt="Clash"
        className="mx-auto w-50 mb-4 animate-bounce"
      />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl flex gap-3 items-center bg-gray-900/60 p-4 rounded-xl shadow-md mb-8"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t("search.playersInClan.placeholder")}
            className="w-full bg-gray-800/70 text-white rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none placeholder-gray-400"
            value={inputValue}
            onChange={handleChange}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">#</span>
        </div>
        <button className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg shadow hover:bg-yellow-500 transition">
          {t("buttons.search")}
        </button>
      </form>

      {loading && (
        <div className="flex justify-center items-center mt-20">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="sr-only">{t("status.loading")}</span>
        </div>
      )}

      {error && !loading && <p className="text-red-400 text-center">{error}</p>}

      {clanInfo && !loading && (
        <div className="w-full max-w-6xl flex flex-col gap-6">
          <div className="bg-gray-900/80 p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-4xl font-bold mb-4">{clanInfo.name}</h2>
            <img
              src={clanInfo.badge?.url}
              alt={clanInfo.name}
              className="w-32 h-32 mx-auto mb-4"
            />
            <p>
              <span className="font-semibold text-yellow-400">
                {t("search.playersInClan.info.tag")}:
              </span>{" "}
              {clanInfo.tag}
            </p>
            <p>
              <span className="font-semibold text-yellow-400">
                {t("search.playersInClan.info.level")}:
              </span>{" "}
              {clanInfo.level}
            </p>
            <p>
              <span className="font-semibold text-yellow-400">
                {t("search.playersInClan.info.members")}:
              </span>{" "}
              {clanInfo.members?.length ?? 0}
            </p>
          </div>

          <div className="overflow-x-auto bg-gray-900/80 p-4 rounded-2xl shadow-xl">
            <h3 className="text-3xl font-bold mb-4">
              {t("search.playersInClan.heading")}
            </h3>
            <table className="min-w-full border-collapse border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-700">{tableHeaders.league}</th>
                  <th className="px-4 py-3 border-b border-gray-700">{tableHeaders.name}</th>
                  <th className="px-4 py-3 border-b border-gray-700">{tableHeaders.tag}</th>
                  <th className="px-4 py-3 border-b border-gray-700">{tableHeaders.level}</th>
                  <th className="px-4 py-3 border-b border-gray-700">{tableHeaders.role}</th>
                  <th className="px-4 py-3 border-b border-gray-700">{tableHeaders.trophies}</th>
                  <th className="px-4 py-3 border-b border-gray-700">{tableHeaders.donations}</th>
                  <th className="px-4 py-3 border-b border-gray-700">{tableHeaders.received}</th>
                  <th className="px-4 py-3 border-b border-gray-700">{tableHeaders.townHall}</th>
                </tr>
              </thead>
              <tbody>
                {members.map((player, idx) => {
                  const normalizedTag = typeof player.tag === "string" ? player.tag.replace("#", "") : "";
                  const playerLink = normalizedTag ? `/player/${normalizedTag}` : null;

                  return (
                    <tr
                      key={player.tag || `member-${idx}`}
                      className={`hover:bg-gray-800 transition ${idx % 2 === 0 ? "bg-gray-900" : "bg-gray-700"}`}
                    >
                      <td className="px-4 py-3 border-b border-gray-700">
                        {playerLink ? (
                          <Link to={playerLink}>
                            <img
                              src={player?.league?.icon?.url}
                              alt={tableHeaders.league}
                              className="w-10"
                            />
                          </Link>
                        ) : (
                          <img
                            src={player?.league?.icon?.url}
                            alt={tableHeaders.league}
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
                      <td className="px-4 py-3 border-b border-gray-700">{player.tag}</td>
                      <td className="px-4 py-3 border-b border-gray-700">{player.expLevel}</td>
                      <td className="px-4 py-3 border-b border-gray-700">{player.role}</td>
                      <td className="px-4 py-3 border-b border-gray-700">{player.trophies}</td>
                      <td className="px-4 py-3 border-b border-gray-700">{player.donations}</td>
                      <td className="px-4 py-3 border-b border-gray-700">{player.received}</td>
                      <td className="px-4 py-3 border-b border-gray-700">{player.townHallLevel}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersInClan;
