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
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 -z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl shadow-[0_10px_30px_-20px_rgba(15,23,42,0.8)]" />
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="flex items-center gap-3 rounded-full bg-white/5 px-3 py-1.5 transition-transform duration-300 hover:scale-[1.02] hover:bg-white/10" href="/">
          <img
            src="/fic.jpeg"
            loading="lazy"
            alt="ReqClans logo"
            className="h-9 w-9 rounded-full border border-white/30 object-cover shadow-lg"
          />
          <span className="text-lg font-semibold tracking-wide text-white">
            ReqClans
          </span>
        </a>

        <nav className="hidden md:block">
          <HoverTapSections />
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sky-400/70 bg-sky-400/20 text-sky-100 transition hover:-translate-y-0.5 hover:border-sky-200/80 hover:bg-sky-300/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            <IoPersonSharp />
          </a>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen ? (
        <div className="md:hidden border-b border-white/10 bg-slate-950/90 px-4 pb-6 pt-4 text-slate-200 shadow-[0_20px_40px_-30px_rgba(15,23,42,1)]">
          <div className="glass-panel border-white/5 bg-slate-900/50 p-5">
            <div className="flex flex-col gap-3 text-base font-semibold text-slate-200">
              <a href="/" className="rounded-lg px-3 py-2 transition hover:bg-white/5" onClick={closeMenu}>
                {t("nav.home")}
              </a>
              <a href="/xp-calculator" className="rounded-lg px-3 py-2 transition hover:bg-white/5" onClick={closeMenu}>
                {t("nav.xpCalculator")}
              </a>
              <a href="/donations" className="rounded-lg px-3 py-2 transition hover:bg-white/5" onClick={closeMenu}>
                {t("nav.donations")}
              </a>
              <a href="/#hub" className="rounded-lg px-3 py-2 transition hover:bg-white/5" onClick={closeMenu}>
                {t("nav.strategyHub")}
              </a>
              <a href="/clans/clan" className="rounded-lg px-3 py-2 transition hover:bg-white/5" onClick={closeMenu}>
                {t("nav.clans.searchByTag")}
              </a>
              <a href="/players/player" className="rounded-lg px-3 py-2 transition hover:bg-white/5" onClick={closeMenu}>
                {t("nav.players.searchByTag")}
              </a>
              <a href="/players/plsyersclan" className="rounded-lg px-3 py-2 transition hover:bg-white/5" onClick={closeMenu}>
                {t("nav.players.searchByClan")}
              </a>
            </div>

            <a
              href="/login"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-400/80 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              onClick={closeMenu}
            >
              <IoPersonSharp size={18} />
              <span>{t("nav.login") ?? "Login"}</span>
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
