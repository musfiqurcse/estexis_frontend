import { BarChart3, Heart, LogOut, MapPin, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "../i18n";
import { useVisitorLocation } from "../hooks/useVisitorLocation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useBuyerAuth } from "../context/BuyerAuthContext";
// import mainLogo from "../assets/main_logo.svg";
import mainLogo from "../assets/Layer_1.svg";

export function Navbar() {
  const { t } = useTranslation();
  const { city, loading } = useVisitorLocation();
  const { isAuthenticated, logout } = useBuyerAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") setSidebarOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  const mobileLinkClass = ({ isActive }) =>
    `flex min-h-12 items-center rounded-lg px-4 text-base font-semibold transition-colors ${
      isActive ? "bg-forest text-white" : "text-ink/75 hover:bg-sage hover:text-forest"
    }`;

  return (
    <>
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
          <NavLink to="/investor" className={({ isActive }) => (isActive ? "text-forest" : "text-ink/70 hover:text-forest")}>
            {t("nav.investor")}
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
          {isAuthenticated ? (
            <button type="button" className="hidden btn-primary sm:inline-flex" onClick={logout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {t("nav.logout")}
            </button>
          ) : (
            <Link to="/login" className="hidden btn-primary sm:inline-flex">
              <User className="h-4 w-4" aria-hidden="true" />
              {t("nav.login")}
            </Link>
          )}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-ink/10 bg-white md:hidden"
            aria-label="Open navigation"
            aria-controls="mobile-navigation-sidebar"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        </nav>
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            id="mobile-navigation-sidebar"
            className="absolute inset-y-0 right-0 flex h-dvh w-[min(88vw,22rem)] flex-col border-l border-ink/10 bg-linen shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
          >
            <div className="flex h-20 items-center justify-between border-b border-ink/10 px-5">
              <Link to="/" className="flex items-center" onClick={() => setSidebarOpen(false)}>
                <img src={mainLogo} alt={t("common.brand")} className="h-8 w-auto" />
              </Link>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-lg border border-ink/10 bg-white text-ink/65 hover:text-ink"
                aria-label="Close navigation"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Mobile navigation">
              <NavLink to="/" end className={mobileLinkClass}>Home</NavLink>
              <NavLink to="/properties" className={mobileLinkClass}>{t("nav.homes")}</NavLink>
              <NavLink to="/blog" className={mobileLinkClass}>Blog</NavLink>
              <NavLink to="/investor" className={mobileLinkClass}>
                <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
                {t("nav.investor")}
              </NavLink>
              <NavLink to="/dashboard" className={mobileLinkClass}>{t("nav.dashboard")}</NavLink>
            </nav>

            <div className="space-y-3 border-t border-ink/10 p-5">
              <div className="flex items-center gap-2 text-sm text-ink/65">
                <MapPin className="h-4 w-4 text-forest" aria-hidden="true" />
                {loading ? <span className="h-3 w-16 animate-pulse rounded bg-ink/10" /> : city}
              </div>
              <Link to="/dashboard" className="btn-secondary w-full" onClick={() => setSidebarOpen(false)}>
                <Heart className="h-4 w-4" aria-hidden="true" />
                {t("nav.saved")}
              </Link>
              {isAuthenticated ? (
                <button type="button" className="btn-primary w-full" onClick={logout}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {t("nav.logout")}
                </button>
              ) : (
                <Link to="/login" className="btn-primary w-full" onClick={() => setSidebarOpen(false)}>
                  <User className="h-4 w-4" aria-hidden="true" />
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
