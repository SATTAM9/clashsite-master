import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../src/i18n/LanguageContext";

export default function Clan() {
  const { t, direction } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [clan, setClan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const trimmedTag = inputValue.trim();
    if (!trimmedTag) {
      setError(t("search.clan.errors.missingTag"));
      return;
    }

    setSelectedValue(trimmedTag);
  };

  useEffect(() => {
    const getClan = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8081/clanbytag/${encodeURIComponent(selectedValue)}`
        );
        const data = await response.json();

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
  }, [selectedValue, t]);

  const desktopAlignment = direction === "rtl" ? "md:text-right" : "md:text-left";

  return (
    <div
      className="h-[500px] bg-gradient-to-r from-[#384f84] via-[#1e293b] to-[#15203a] p-6 rounded-2xl shadow-2xl text-white flex flex-col"
      dir={direction}
    >
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 items-center bg-gray-900/60 p-3 rounded-xl shadow-md mb-6"
      >
        <div className="relative w-full">
          <input
            type="text"
            className="w-full bg-gray-800/70 text-white rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none placeholder-gray-400"
            placeholder={t("search.clan.placeholder")}
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
        <div className="flex justify-center items-center flex-1">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="sr-only">{t("status.loading")}</span>
        </div>
      )}

      {error && !loading && (
        <div className="text-red-400 text-center flex-1 flex items-center justify-center">
          {error}
        </div>
      )}

      {clan && !loading && (
        <div className="bg-gray-900/80 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg transition hover:scale-105">
          <Link to={`/clan/${clan.tag.replace("#", "")}`}>
            <img
              src={clan.badge?.url}
              alt={clan.name}
              className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-md"
            />
          </Link>
          <div className={`space-y-2 text-center ${desktopAlignment}`}>
            <p className="text-xl font-bold">{clan.name}</p>
            <p>
              <span className="font-semibold text-yellow-400">
                {t("search.clan.labels.tag")}:
              </span>{" "}
              {clan.tag}
            </p>
            <p>
              <span className="font-semibold text-yellow-400">
                {t("search.clan.labels.level")}:
              </span>{" "}
              {clan.level}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
