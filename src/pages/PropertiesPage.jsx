import { Map, SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "../components/FilterSidebar";
import { PropertyCard } from "../components/PropertyCard";
import { SearchBar } from "../components/SearchBar";
import { properties } from "../data/properties";
import { useTranslation } from "../i18n";

export function PropertiesPage() {
  const { t } = useTranslation();

  return (
    <div className="page-shell py-10">
      <div className="mb-8">
        <h1 className="section-title">{t("properties.title")}</h1>
        <p className="mt-3 max-w-2xl muted">{t("properties.subtitle")}</p>
      </div>
      <SearchBar compact />
      <div className="mt-8 flex items-center justify-between gap-3">
        <button className="btn-secondary lg:hidden">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          {t("properties.mobileFilters")}
        </button>
        <label className="ms-auto flex items-center gap-2 text-sm">
          {t("properties.sort")}
          <select className="input-field w-auto">
            <option>{t("properties.recommended")}</option>
            <option>{t("properties.priceLow")}</option>
            <option>{t("properties.priceHigh")}</option>
          </select>
        </label>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr_320px]">
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <aside className="hidden rounded-lg border border-ink/10 bg-white p-5 lg:block">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Map className="h-5 w-5 text-forest" aria-hidden="true" />
            {t("properties.map")}
          </h2>
          <div className="mt-4 grid h-72 place-items-center rounded-lg bg-sage p-6 text-center text-sm text-forest">
            {t("properties.mapText")}
          </div>
        </aside>
      </div>
    </div>
  );
}
