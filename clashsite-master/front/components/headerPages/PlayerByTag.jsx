import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useLanguage } from "../../src/i18n/LanguageContext";

import PlayerCollections from "../ui/TapPlayer";

export default function PlayerByTag() {

  const { t, direction } = useLanguage();

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

      setError(t("search.player.errors.missingTag"));

      return;

    }

    setSelectedValue(trimmedTag);

  };

  useEffect(() => {

    const getPlayer = async () => {

      try {

        setLoading(true);

        setError("");

        const res = await fetch("http://localhost:8081/playerbytag", {

          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ tag: selectedValue }),

        });

        const data = await res.json();

        if (data.success && data.playerInfo) {

          setPlayer(data.playerInfo);

        } else {

          setPlayer(null);

          const fallbackMessage = t("search.player.errors.fetchFailed");

          const normalized =

            data.error === "invalid_tag"

              ? t("search.player.errors.missingTag")

              : fallbackMessage;

          setError(typeof data.error === "string" && data.error.trim() ? normalized : fallbackMessage);

        }

      } catch (err) {

        console.error("Error fetching player:", err);

        setPlayer(null);

        setError(t("search.player.errors.fetchFailed"));

      } finally {

        setLoading(false);

      }

    };

    if (selectedValue) {

      getPlayer();

    }

  }, [selectedValue, t]);

  const desktopAlignment = direction === "rtl" ? "md:text-right" : "md:text-left";

  const headingAlignment = direction === "rtl" ? "text-right" : "text-left";

  const playerName = player?.name || t("search.player.fallbacks.unknownPlayer");

  const clanName = player?.clan?.name || t("search.player.fallbacks.noClan");

  const sectionOrder = ["troops", "spells", "heroes", "equipment", "achievements"];

  const availableSections = sectionOrder.filter((section) => {

    if (!player) {

      return false;

    }

    if (section === "equipment") {

      const equipment = player.heroEquipment ?? player.equipment;

      return Array.isArray(equipment) && equipment.length > 0;

    }

    const key = section === "achievements" ? "achievements" : section;

    return Array.isArray(player[key]) && player[key].length > 0;

  });

  return (

    <div

      className="min-h-screen bg-gradient-to-r from-[#384f84] via-[#1e293b] to-[#15203a] p-8 flex flex-col items-center text-white"

      dir={direction}

    >

      <img

        src="/icons/pets/Hero_Pet_HV_Frosty_3_grass.png"

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

            className="w-full bg-gray-800/70 text-white rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none placeholder-gray-400"

            placeholder={t("search.player.placeholder")}

            value={inputValue}

            onChange={handleChange}

          />

          <span className="absolute left-3 top-2.5 text-gray-400">#</span>

        </div>

        <button

          type="submit"

          className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg shadow hover:bg-yellow-500 transition"

        >

          {t("buttons.search")}

        </button>

      </form>

      {loading && (

        <div className="flex justify-center items-center flex-1 mt-20">

          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>

          <span className="sr-only">{t("status.loading")}</span>

        </div>

      )}

      {error && !loading && (

        <div className="text-red-400 text-center mt-10">{error}</div>

      )}

      {player && !loading && (

        <>

          <div className="w-full max-w-5xl bg-gray-900/80 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg transition hover:scale-105">

            {player.clan?.badge?.url && (

              <Link to={`/player/${player.tag.replace("#", "")}`} className="flex-shrink-0">

                <img

                  src={player.clan.badge.url}

                  alt={t("search.player.badgeAlt")}

                  className="w-40 h-40 rounded-full border-4 border-yellow-400 shadow-md"

                />

              </Link>

            )}

            <div className={`flex-1 space-y-4 text-center ${desktopAlignment}`}>

              <p className="text-3xl font-bold">{playerName}</p>

              <p>

                <span className="font-semibold text-yellow-400">

                  {t("search.player.labels.tag")}:

                </span>{" "}

                {player.tag || "-"}

              </p>

              <p>

                <span className="font-semibold text-yellow-400">

                  {t("search.player.labels.trophies")}:

                </span>{" "}

                {player.trophies ?? "-"}

              </p>

              <p>

                <span className="font-semibold text-yellow-400">

                  {t("search.player.labels.level")}:

                </span>{" "}

                {player.expLevel ?? "-"}

              </p>

              <p>

                <span className="font-semibold text-yellow-400">

                  {t("search.player.labels.clan")}:

                </span>{" "}

                {clanName}

              </p>

              <p>

                <span className="font-semibold text-yellow-400">

                  {t("search.player.labels.role")}:

                </span>{" "}

                {player.role ?? "-"}

              </p>

              <p>

                <span className="font-semibold text-yellow-400">

                  {t("search.player.labels.donations")}:

                </span>{" "}

                {player.donations ?? "-"}

              </p>

            </div>

          </div>

          {availableSections.length > 0 && (

            <div className="w-full max-w-6xl mt-10 space-y-10">

              {availableSections.map((section) => (

                <section

                  key={section}

                  className="rounded-3xl bg-gray-900/80 p-6 shadow-xl"

                >

                  <div className={`mb-4 ${headingAlignment}`}>

                    <h2 className="text-2xl font-bold text-yellow-400">

                      {t(`search.player.sections.${section}`)}

                    </h2>

                  </div>

                  <PlayerCollections section={section} player={player} />

                </section>

              ))}

            </div>

          )}

        </>

      )}

    </div>

  );

}

