import { Heart, MapPin, Menu, User } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "../i18n";
import { useVisitorLocation } from "../hooks/useVisitorLocation";
import { LanguageSwitcher } from "./LanguageSwitcher";
// import mainLogo from "../assets/main_logo.svg";
import mainLogo from "../assets/Layer_1.svg";

export function Navbar() {
  const { t } = useTranslation();
  const { city, loading } = useVisitorLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-linen/95 backdrop-blur">
      <nav className="page-shell flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center">
          <img src={mainLogo} alt={t("common.brand")} className="h-7 w-auto sm:h-9 md:h-10" />
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <NavLink to="/properties" className={({ isActive }) => (isActive ? "text-forest" : "text-ink/70 hover:text-forest")}>
            {t("nav.homes")}
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? "text-forest" : "text-ink/70 hover:text-forest")}>
            Blog
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "text-forest" : "text-ink/70 hover:text-forest")}>
            {t("nav.dashboard")}
          </NavLink>
          <span className="flex items-center gap-1 text-ink/70">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {loading ? <span className="w-12 animate-pulse rounded bg-ink/10 h-3" /> : city}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link to="/dashboard" className="hidden btn-secondary sm:inline-flex">
            <Heart className="h-4 w-4" aria-hidden="true" />
            {t("nav.saved")}
          </Link>
          <button className="hidden btn-primary sm:inline-flex">
            <User className="h-4 w-4" aria-hidden="true" />
            {t("nav.login")}
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-ink/10 bg-white md:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
}
