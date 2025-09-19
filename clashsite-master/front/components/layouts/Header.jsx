import { useState } from "react";
import { Menu, X } from "lucide-react";
import { IoPersonSharp } from "react-icons/io5";
import HoverTapSections from "../ui/HeaderTaps";
import { useLanguage } from "../../src/i18n/LanguageContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a className="flex items-center gap-2 group" href="/">
          <img
            src="/fic.jpeg"
          loading="lazy"
            alt="logo"
            className="w-10 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-xl font-extrabold tracking-wide text-white group-hover:text-yellow-400 transition-colors">
            ReqClans
          </span>
        </a>

        <nav className="hidden sm:block">
          <HoverTapSections />
        </nav>

        <div className="hidden sm:flex items-center gap-4">
          <a
            href="/login"
            className="px-5 py-2 rounded-full bg-yellow-400 text-black font-bold shadow-md hover:bg-yellow-300 transition-all"
          >
            <IoPersonSharp />
          </a>
        </div>

        <button
          className="sm:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="sm:hidden flex flex-col items-center bg-[#1e293b] px-6 py-4 space-y-4 text-gray-300 font-semibold">
          <a href="/" className="block hover:text-yellow-400 transition-colors" onClick={closeMenu}>
            {t("nav.home")}
          </a>
          <a href="/xp-calculator" className="block hover:text-yellow-400 transition-colors" onClick={closeMenu}>
            {t("nav.xpCalculator")}
          </a>
          <a href="/donations" className="block hover:text-yellow-400 transition-colors" onClick={closeMenu}>
            {t("nav.donations")}
          </a>
          <a href="/#hub" className="block hover:text-yellow-400 transition-colors" onClick={closeMenu}>
            {t("nav.strategyHub")}
          </a>
          <a href="/clans/clan" className="block hover:text-yellow-400 transition-colors" onClick={closeMenu}>
            {t("nav.clans.searchByTag")}
          </a>
          <a href="/players/player" className="block hover:text-yellow-400 transition-colors" onClick={closeMenu}>
            {t("nav.players.searchByTag")}
          </a>
          <a href="/players/plsyersclan" className="block hover:text-yellow-400 transition-colors" onClick={closeMenu}>
            {t("nav.players.searchByClan")}
          </a>
          <a
            href="/login"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-black font-bold shadow-md hover:bg-yellow-300 transition-all"
            onClick={closeMenu}
          >
            <IoPersonSharp size={20} />
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
