import { Link } from "react-router-dom";
import { useLanguage } from "../../src/i18n/LanguageContext";

const HoverTapSections = () => {
  const { t, direction } = useLanguage();

  const dropdownPositionClass = direction === "rtl" ? "right-0" : "left-0";

  return (
    <ul className="flex items-center gap-8 text-gray-300 font-semibold">
      <li className="relative group cursor-pointer">
        <span className="hover:text-yellow-400 transition-colors duration-200">
          {t("nav.clans.label")}
        </span>
        <ul
          className={`absolute top-full ${dropdownPositionClass} mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-10`}
        >
          <li>
            <Link
              to="/clans/clan"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              {t("nav.clans.searchByTag")}
            </Link>
          </li>
        </ul>
      </li>

      <li className="relative group cursor-pointer">
        <span className="hover:text-yellow-400 transition-colors duration-200">
          {t("nav.players.label")}
        </span>
        <ul
          className={`absolute top-full ${dropdownPositionClass} mt-2 w-56 bg-gray-800 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-10`}
        >
          <li>
            <Link
              to="/players/player"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              {t("nav.players.searchByTag")}
            </Link>
          </li>
          <li>
            <Link
              to="/players/plsyersclan"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              {t("nav.players.searchByClan")}
            </Link>
          </li>
        </ul>
      </li>

      <li>
        <Link
          to="/donations"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
          {t("nav.donations")}
        </Link>
      </li>

      <li>
        <Link
          to="/xp-calculator"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
          {t("nav.xpCalculator")}
        </Link>
      </li>

      <li>
        <Link
          to="/#hub"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
          {t("nav.strategyHub")}
        </Link>
      </li>

      <li>
        <Link
          to="/"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
          {t("nav.home")}
        </Link>
      </li>
    </ul>
  );
};

export default HoverTapSections;
