import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../src/i18n/LanguageContext";

export default function ClanByTag() {
  const { t, direction } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [clan, setClan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const handleChange = (event) => setInputValue(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const trimmedTag = inputValue.trim();
    if (!trimmedTag) {
      setError(t("search.clan.errors.missingTag"));
      return;
    }

    setSelectedValue(trimmedTag);
    setSearchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const getClan = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `http://localhost:8081/clanbytag/${encodeURIComponent(selectedValue)}`
        );
        const data = await res.json();

        if (data.success && data.clanInfo) {
          setClan(data.clanInfo);
        } else {
          setClan(null);
          const fallbackMessage = t("search.clan.errors.fetchFailed");
          const normalized =
            data.error === "invalid_tag"
              ? t("search.clan.errors.missingTag")
              : fallbackMessage;
          setError(typeof data.error === "string" && data.error.trim() ? normalized : fallbackMessage);
        }
      } catch (err) {
        console.error("Error fetching clan:", err);
        setClan(null);
        setError(t("search.clan.errors.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };

    if (selectedValue) {
      getClan();
    }
  }, [selectedValue, searchTrigger, t]);

  const desktopAlignment = direction === "rtl" ? "md:text-right" : "md:text-left";
  const description = clan?.description || t("search.clan.messages.noDescription");

  return (
    <div
      className="min-h-screen bg-gradient-to-r from-[#384f84] via-[#1e293b] to-[#15203a] p-6 text-white flex flex-col items-center"
      dir={direction}
    >
      <img
        src="/fic.jpeg"
        alt="Clash"
        className="mx-auto w-50 mb-4 animate-bounce"
      />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl flex gap-3 items-center bg-gray-900/70 p-4 rounded-xl shadow-md mb-6"
      >
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full bg-gray-800/70 text-white rounded-lg pl-10 pr-3 py-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none placeholder-gray-400 text-lg"
            placeholder={t("search.clan.placeholder")}
            value={inputValue}
            onChange={handleChange}
          />
          <span className="absolute left-3 top-3 text-gray-400">#</span>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg shadow hover:bg-yellow-500 transition text-lg"
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
        <div className="flex flex-col items-center justify-center mt-20 text-center text-white px-4">
          <img
            src="/assets/coc/icons/super-troop-pics/Icon_HV_Super_Wall_Breaker.png"
            alt={t("search.clan.messages.errorTitle")}
            className="h-60 mb-6 object-contain opacity-90"
          />
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            {t("search.clan.messages.errorTitle")}
          </h2>
          <p className="text-gray-300 mb-4 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg transition"
          >
            {t("search.clan.messages.tryAgain")}
          </button>
        </div>
      )}

      {clan && !loading && (
        <div className="w-full max-w-5xl bg-gray-900/80 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg transition hover:scale-105">
          <Link to={`/clan/${clan.tag.replace("#", "")}`} className="flex-shrink-0">
            <img
              src={clan.badge?.url}
              alt={clan.name}
              className="w-40 h-40 rounded-full border-4 border-yellow-400 shadow-md"
            />
          </Link>
          <div className={`flex-1 space-y-4 text-center ${desktopAlignment}`}>
            <p className="text-3xl font-bold">{clan.name}</p>
            <p className="text-xl">
              <span className="font-semibold text-yellow-400">
                {t("search.clan.labels.tag")}:
              </span>{" "}
              {clan.tag}
            </p>
            <p className="text-xl">
              <span className="font-semibold text-yellow-400">
                {t("search.clan.labels.level")}:
              </span>{" "}
              {clan.level}
            </p>
            <p className="text-xl">
              <span className="font-semibold text-yellow-400">
                {t("search.clan.labels.name")}:
              </span>{" "}
              {clan.name}
            </p>
            <p className="text-xl">
              <span className="font-semibold text-yellow-400">
                {t("search.clan.messages.noDescription")}:
              </span>{" "}
              {description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
