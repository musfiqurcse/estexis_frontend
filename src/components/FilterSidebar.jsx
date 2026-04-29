import { SlidersHorizontal } from "lucide-react";
import { categories } from "../data/properties";
import { useTranslation } from "../i18n";

export function FilterSidebar() {
  const { t, formatCurrency } = useTranslation();
  const amenityKeys = ["wifi", "pool", "kitchen", "workspace", "parking", "balcony"];

  return (
    <aside className="rounded-lg border border-ink/10 bg-white p-5">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
        <SlidersHorizontal className="h-5 w-5 text-forest" aria-hidden="true" />
        {t("properties.filters")}
      </h2>
      <div className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-semibold">{t("home.destination")}</span>
          <input className="input-field" placeholder={t("home.destinationPlaceholder")} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">{t("home.priceRange")}</span>
          <input type="range" min="100000" max="800000" defaultValue="420000" className="w-full accent-forest" />
          <span className="text-sm text-ink/60">{formatCurrency(100000)} - {formatCurrency(800000)}</span>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">{t("home.propertyType")}</span>
          <select className="input-field">
            {categories.map((category) => (
              <option key={category.key}>{t(`categories.${category.key}`)}</option>
            ))}
          </select>
        </label>
        <div className="space-y-3">
          <span className="text-sm font-semibold">{t("properties.amenities")}</span>
          {amenityKeys.map((amenity) => (
            <label key={amenity} className="flex items-center gap-3 text-sm text-ink/75">
              <input type="checkbox" className="h-4 w-4 accent-forest" defaultChecked={amenity === "wifi"} />
              {t(`amenities.${amenity}`)}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
