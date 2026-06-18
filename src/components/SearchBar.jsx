import { DollarSign, Home, MapPin, Search, Tag, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "../i18n";
import { assetTypeOptions, listingPurposeOptions, toSearchParams } from "../lib/listingUtils";

export function SearchBar({ compact = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(() => ({
    city: searchParams.get("city") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    asset_type: searchParams.get("asset_type") || "",
    listing_purpose: searchParams.get("listing_purpose") || "sale",
  }));

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form
      className={`grid gap-3 rounded-lg border border-ink/10 bg-white p-3 shadow-soft ${compact ? "lg:grid-cols-6" : "lg:grid-cols-[1.3fr_0.85fr_1fr_1fr_0.8fr_0.9fr_auto]"}`}
      onSubmit={(event) => {
        event.preventDefault();
        const query = toSearchParams({ ...form, page: 1, page_size: searchParams.get("page_size") || 20 }).toString();
        navigate(`/properties${query ? `?${query}` : ""}`);
      }}
    >
      <label className="space-y-1">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/55">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {t("home.destination")}
        </span>
        <input
          className="input-field"
          placeholder={t("home.destinationPlaceholder")}
          value={form.city}
          onChange={(event) => updateField("city", event.target.value)}
        />
      </label>
      <label className="space-y-1">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/55">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          Purpose
        </span>
        <select
          className="input-field"
          value={form.listing_purpose}
          onChange={(event) => updateField("listing_purpose", event.target.value)}
        >
          {listingPurposeOptions.map((option) => (
            <option key={option.value || "any"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/55">
          <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
          {t("home.checkIn")}
        </span>
        <input
          className="input-field"
          type="number"
          min="0"
          step="5000"
          value={form.min_price}
          onChange={(event) => updateField("min_price", event.target.value)}
          placeholder="0"
        />
      </label>
      <label className="space-y-1">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/55">
          <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
          {t("home.checkOut")}
        </span>
        <input
          className="input-field"
          type="number"
          min="0"
          step="5000"
          value={form.max_price}
          onChange={(event) => updateField("max_price", event.target.value)}
          placeholder="Any"
        />
      </label>
      <label className="space-y-1">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/55">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {t("common.bedrooms")}
        </span>
        <input
          className="input-field"
          type="number"
          min="0"
          value={form.bedrooms}
          onChange={(event) => updateField("bedrooms", event.target.value)}
          placeholder="Any"
        />
      </label>
      <label className="space-y-1">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/55">
          <Home className="h-3.5 w-3.5" aria-hidden="true" />
          {t("home.propertyType")}
        </span>
        <select
          className="input-field"
          value={form.asset_type}
          onChange={(event) => updateField("asset_type", event.target.value)}
        >
          {assetTypeOptions.map((option) => (
            <option key={option.value || "any"} value={option.value}>
              {option.label}
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
