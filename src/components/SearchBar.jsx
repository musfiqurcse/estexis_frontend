import { DollarSign, Home, MapPin, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/properties";
import { useTranslation } from "../i18n";

export function SearchBar({ compact = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <form
      className={`grid gap-3 rounded-lg border border-ink/10 bg-white p-3 shadow-soft ${compact ? "lg:grid-cols-5" : "lg:grid-cols-[1.3fr_1fr_1fr_0.8fr_0.9fr_auto]"}`}
      onSubmit={(event) => {
        event.preventDefault();
        navigate("/properties");
      }}
    >
      <label className="space-y-1">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/55">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {t("home.destination")}
        </span>
        <input className="input-field" placeholder={t("home.destinationPlaceholder")} />
      </label>
      <label className="space-y-1">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/55">
          <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
          {t("home.checkIn")}
        </span>
        <input className="input-field" type="number" min="50000" step="5000" defaultValue="150000" />
      </label>
      <label className="space-y-1">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/55">
          <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
          {t("home.checkOut")}
        </span>
        <input className="input-field" type="number" min="100000" step="5000" defaultValue="450000" />
      </label>
      <label className="space-y-1">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/55">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {t("common.bedrooms")}
        </span>
        <input className="input-field" type="number" min="1" defaultValue="3" />
      </label>
      <label className="space-y-1">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/55">
          <Home className="h-3.5 w-3.5" aria-hidden="true" />
          {t("home.propertyType")}
        </span>
        <select className="input-field" defaultValue="apartments">
          {categories.map((category) => (
            <option key={category.key} value={category.key}>
              {t(`categories.${category.key}`)}
            </option>
          ))}
        </select>
      </label>
      <button className="btn-primary self-end">
        <Search className="h-4 w-4" aria-hidden="true" />
        {t("common.search")}
      </button>
    </form>
  );
}
