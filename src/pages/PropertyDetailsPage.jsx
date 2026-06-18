import { AlertCircle, ArrowLeft, Bath, BedDouble, BadgeCheck, Loader2, MapPin, Ruler } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookingCard } from "../components/BookingCard";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyGallery } from "../components/PropertyGallery";
import { useTranslation } from "../i18n";
import { getPublicListing, getSimilarListings } from "../lib/listingApi";
import { formatLabel, getListingLocation } from "../lib/listingUtils";

function DetailPill({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <span className="rounded-lg border border-ink/10 bg-white p-4 text-sm font-medium">
      <span className="block text-xs font-semibold uppercase text-ink/45">{label}</span>
      <span className="mt-1 block">{value}</span>
    </span>
  );
}

export function PropertyDetailsPage() {
  const { id } = useParams();
  const { t, formatNumber } = useTranslation();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setProperty(null);

    getPublicListing(id, { source: "direct" })
      .then((data) => {
        if (!cancelled) setProperty(data);
      })
      .catch((apiError) => {
        if (!cancelled) setError(apiError.message || "Unable to load listing.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    setSimilarLoading(true);

    getSimilarListings(id)
      .then((data) => {
        if (!cancelled) setSimilar(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setSimilar([]);
      })
      .finally(() => {
        if (!cancelled) setSimilarLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page-shell grid min-h-[520px] place-items-center py-10 text-sm text-ink/55">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          Loading listing
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="page-shell py-10">
        <Link to="/properties" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-forest">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t("common.back")}
        </Link>
        <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error || "Listing not found."}
        </div>
      </div>
    );
  }

  const location = getListingLocation(property);
  const title = property.title || `${formatLabel(property.asset_type)} in ${property.city || "selected location"}`;
  const detailFields = [
    ["Purpose", formatLabel(property.listing_purpose)],
    ["Category", formatLabel(property.property_category)],
    ["Condition", formatLabel(property.property_condition)],
    ["Furnishing", formatLabel(property.furnished_status)],
    ["Size", property.size_value ? `${property.size_value} ${property.size_unit || ""}` : ""],
    ["Floor", property.floor_number ? `${property.floor_number}${property.total_floors ? ` of ${property.total_floors}` : ""}` : ""],
    ["Parking", property.parking_spaces],
    ["Available from", property.available_from],
    ["Energy class", property.energy_class],
    ["Tenure", formatLabel(property.tenure_type)],
  ];
  const amenities = [
    ...(property.indoor_amenities || []),
    ...(property.building_amenities || []),
    ...(property.community_amenities || []),
    ...(property.nearby_transport || []),
  ];

  return (
    <div className="page-shell py-10">
      <Link to="/properties" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-forest">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("common.back")}
      </Link>
      <PropertyGallery property={property} />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <div className="border-b border-ink/10 pb-6">
            <p className="mb-3 flex items-center gap-2 text-sm text-ink/65">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {location || "Location available on request"}
            </p>
            <h1 className="text-3xl font-semibold md:text-5xl">{title}</h1>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-ink/70">
              {property.verified_badge_status && <span className="flex items-center gap-1"><BadgeCheck className="h-4 w-4 text-forest" />{formatLabel(property.verified_badge_status)}</span>}
              <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{property.bedrooms ? formatNumber(property.bedrooms) : "—"} {t("common.bedrooms")}</span>
              <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{property.bathrooms ? formatNumber(property.bathrooms) : "—"} {t("common.bathrooms")}</span>
              <span className="flex items-center gap-1"><Ruler className="h-4 w-4" />{property.size_value || "—"} {property.size_unit || ""}</span>
            </div>
          </div>
          <div className="grid gap-8 py-8">
            <section>
              <h2 className="mb-3 text-xl font-semibold">{t("details.description")}</h2>
              <p className="max-w-3xl leading-7 text-ink/70">{property.description || property.short_description || "Full description is not available for this listing yet."}</p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold">Listing details</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {detailFields.map(([label, value]) => (
                  <DetailPill key={label} label={label} value={value} />
                ))}
              </div>
            </section>
            {amenities.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-semibold">{t("details.amenities")}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {amenities.map((amenity) => (
                    <span key={amenity} className="rounded-lg border border-ink/10 bg-white p-4 text-sm font-medium">
                      {formatLabel(amenity)}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
        <BookingCard property={property} />
      </div>
      {(similarLoading || similar.length > 0) && <section className="mt-12">
        <h2 className="mb-6 section-title">{t("details.similar")}</h2>
        {similarLoading ? (
          <div className="rounded-lg border border-ink/10 bg-white p-6 text-sm text-ink/55">Loading similar listings</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {similar.map((item) => (
              <PropertyCard key={item.public_id || item.id || item.slug} property={item} />
            ))}
          </div>
        )}
      </section>}
    </div>
  );
}
