import { AlertCircle, Loader2, Map, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterSidebar } from "../components/FilterSidebar";
import { PropertyCard } from "../components/PropertyCard";
import { SearchBar } from "../components/SearchBar";
import { useTranslation } from "../i18n";
import { searchListings } from "../lib/listingApi";
import { toSearchParams } from "../lib/listingUtils";

const filterKeys = [
  "listing_purpose",
  "property_category",
  "asset_type",
  "country_code",
  "city",
  "district_area",
  "min_price",
  "max_price",
  "min_size",
  "max_size",
  "bedrooms",
  "bathrooms",
  "price_reduced",
  "property_condition",
  "furnished_status",
  "page",
  "page_size",
];

function readFilters(searchParams) {
  return filterKeys.reduce((filters, key) => {
    const value = searchParams.get(key);
    if (value) filters[key] = value;
    return filters;
  }, {});
}

export function PropertiesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [draftFilters, setDraftFilters] = useState(() => readFilters(searchParams));
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const page = Number(filters.page || 1);
  const pageSize = Number(filters.page_size || 20);
  const hasNextPage = listings.length >= pageSize;

  useEffect(() => {
    setDraftFilters(readFilters(searchParams));
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    searchListings({ page: 1, page_size: 20, ...filters })
      .then((data) => {
        if (!cancelled) setListings(Array.isArray(data) ? data : data?.items || []);
      })
      .catch((apiError) => {
        if (!cancelled) {
          setListings([]);
          setError(apiError.message || "Unable to load listings.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  useEffect(() => {
    if (!mobileFiltersOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") setMobileFiltersOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileFiltersOpen]);

  function applyFilters(event) {
    event.preventDefault();
    setSearchParams(toSearchParams({ ...draftFilters, page: 1, page_size: pageSize || 20 }));
    setMobileFiltersOpen(false);
  }

  function resetFilters() {
    setDraftFilters({});
    setSearchParams(toSearchParams({ page: 1, page_size: pageSize || 20 }));
    setMobileFiltersOpen(false);
  }

  function goToPage(nextPage) {
    setSearchParams(toSearchParams({ ...filters, page: Math.max(1, nextPage), page_size: pageSize || 20 }));
  }

  return (
    <div className="page-shell py-10">
      <div className="mb-8">
        <h1 className="section-title">{t("properties.title")}</h1>
        <p className="mt-3 max-w-2xl muted">{t("properties.subtitle")}</p>
      </div>
      <SearchBar compact />
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          className="btn-secondary lg:hidden"
          aria-controls="mobile-filter-sidebar"
          aria-expanded={mobileFiltersOpen}
          onClick={() => setMobileFiltersOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          {t("properties.mobileFilters")}
        </button>
        <label className="ms-auto flex items-center gap-2 text-sm text-ink/50">
          {t("properties.sort")}
          <select className="input-field w-auto" disabled>
            <option>{t("properties.recommended")}</option>
          </select>
        </label>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <aside
            id="mobile-filter-sidebar"
            className="absolute inset-y-0 left-0 w-[min(90vw,22rem)] overflow-y-auto bg-linen p-4 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Property filters"
          >
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-lg border border-ink/10 bg-white text-ink/65 hover:text-ink"
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <FilterSidebar values={draftFilters} onChange={setDraftFilters} onApply={applyFilters} onReset={resetFilters} />
          </aside>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr_320px]">
        <div className="hidden lg:block">
          <FilterSidebar values={draftFilters} onChange={setDraftFilters} onApply={applyFilters} onReset={resetFilters} />
        </div>
        <div>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {loading ? (
            <div className="grid min-h-80 place-items-center rounded-lg border border-ink/10 bg-white text-sm text-ink/55">
              <div className="text-center">
                <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                Loading listings
              </div>
            </div>
          ) : listings.length === 0 ? (
            <div className="grid min-h-80 place-items-center rounded-lg border border-ink/10 bg-white p-8 text-center">
              <div>
                <h2 className="text-lg font-semibold text-ink">No listings found</h2>
                <p className="mt-2 muted">Try adjusting your filters or search for a different city.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                {listings.map((property) => (
                  <PropertyCard key={property.public_id || property.id || property.slug} property={property} />
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between rounded-lg border border-ink/10 bg-white p-4 text-sm text-ink/60">
                <span>Page {page}</span>
                <div className="flex gap-2">
                  <button className="btn-secondary py-1.5 text-xs" disabled={page <= 1 || loading} onClick={() => goToPage(page - 1)}>
                    Previous
                  </button>
                  <button className="btn-secondary py-1.5 text-xs" disabled={!hasNextPage || loading} onClick={() => goToPage(page + 1)}>
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
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
