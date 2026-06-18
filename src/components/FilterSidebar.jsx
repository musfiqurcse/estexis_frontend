import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "../i18n";
import {
  assetTypeOptions,
  furnishedStatusOptions,
  listingPurposeOptions,
  propertyCategoryOptions,
  propertyConditionOptions,
} from "../lib/listingUtils";

export function FilterSidebar({ values, onChange, onApply, onReset }) {
  const { t } = useTranslation();

  function update(field, value) {
    onChange({ ...values, [field]: value });
  }

  return (
    <form className="rounded-lg border border-ink/10 bg-white p-5" onSubmit={onApply}>
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
        <SlidersHorizontal className="h-5 w-5 text-forest" aria-hidden="true" />
        {t("properties.filters")}
      </h2>
      <div className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-semibold">{t("home.destination")}</span>
          <input
            className="input-field"
            placeholder={t("home.destinationPlaceholder")}
            value={values.city || ""}
            onChange={(event) => update("city", event.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">District or area</span>
          <input
            className="input-field"
            placeholder="Neighborhood or district"
            value={values.district_area || ""}
            onChange={(event) => update("district_area", event.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Purpose</span>
          <select className="input-field" value={values.listing_purpose || ""} onChange={(event) => update("listing_purpose", event.target.value)}>
            {listingPurposeOptions.map((option) => (
              <option key={option.value || "any"} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Category</span>
          <select className="input-field" value={values.property_category || ""} onChange={(event) => update("property_category", event.target.value)}>
            {propertyCategoryOptions.map((option) => (
              <option key={option.value || "any"} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">{t("home.propertyType")}</span>
          <select className="input-field" value={values.asset_type || ""} onChange={(event) => update("asset_type", event.target.value)}>
            {assetTypeOptions.map((option) => (
              <option key={option.value || "any"} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-2">
            <span className="text-sm font-semibold">Min price</span>
            <input className="input-field" type="number" min="0" value={values.min_price || ""} onChange={(event) => update("min_price", event.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold">Max price</span>
            <input className="input-field" type="number" min="0" value={values.max_price || ""} onChange={(event) => update("max_price", event.target.value)} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-2">
            <span className="text-sm font-semibold">Min size</span>
            <input className="input-field" type="number" min="0" value={values.min_size || ""} onChange={(event) => update("min_size", event.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold">Max size</span>
            <input className="input-field" type="number" min="0" value={values.max_size || ""} onChange={(event) => update("max_size", event.target.value)} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-2">
            <span className="text-sm font-semibold">{t("common.bedrooms")}</span>
            <input className="input-field" type="number" min="0" value={values.bedrooms || ""} onChange={(event) => update("bedrooms", event.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold">{t("common.bathrooms")}</span>
            <input className="input-field" type="number" min="0" value={values.bathrooms || ""} onChange={(event) => update("bathrooms", event.target.value)} />
          </label>
        </div>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Condition</span>
          <select className="input-field" value={values.property_condition || ""} onChange={(event) => update("property_condition", event.target.value)}>
            {propertyConditionOptions.map((option) => (
              <option key={option.value || "any"} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Furnishing</span>
          <select className="input-field" value={values.furnished_status || ""} onChange={(event) => update("furnished_status", event.target.value)}>
            {furnishedStatusOptions.map((option) => (
              <option key={option.value || "any"} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 text-sm text-ink/75">
          <input
            type="checkbox"
            className="h-4 w-4 accent-forest"
            checked={values.price_reduced === "true"}
            onChange={(event) => update("price_reduced", event.target.checked ? "true" : "")}
          />
          Price reduced
        </label>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onReset}>
            Reset
          </button>
          <button type="submit" className="btn-primary">
            Apply
          </button>
        </div>
      </div>
    </form>
  );
}
