import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";
import mainLogo from "../assets/Layer_1.svg";
import iosAppBadge from "../assets/ios_app_coming_soon.png";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-20 border-t border-ink/10 bg-white">
      <div className="page-shell grid gap-8 py-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center">
            <img src={mainLogo} alt={t("common.brand")} className="h-8 w-auto sm:h-9" />
          </Link>
          <p className="mt-3 max-w-md muted">{t("footer.text")}</p>
        </div>
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">{t("footer.company")}</h3>
          <Link className="block text-ink/65 hover:text-forest" to="/properties">{t("nav.homes")}</Link>
          <Link className="block text-ink/65 hover:text-forest" to="/dashboard">{t("nav.dashboard")}</Link>
        </div>
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">{t("footer.support")}</h3>
          <Link className="block text-ink/65 hover:text-forest" to="/terms-and-conditions">{t("footer.terms")}</Link>
          <Link className="block text-ink/65 hover:text-forest" to="/privacy-policy">{t("footer.privacy")}</Link>
          <Link className="block text-ink/65 hover:text-forest" to="/imprint">{t("footer.imprint")}</Link>
          <Link className="block text-ink/65 hover:text-forest" to="/impressum">{t("footer.impressum")}</Link>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">{t("footer.mobileApps")}</h3>
          <div>
            <img src={iosAppBadge} alt="iOS App Store" className="h-10 w-auto hover:opacity-80 transition" />
          </div>
        </div>
      </div>
    </footer>
  );
}
