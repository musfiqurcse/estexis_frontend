import { Bath, BedDouble, BadgeCheck, MapPin, Ruler, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";
import {
  formatLabel,
  formatMoney,
  getListingImages,
  getListingLocation,
  getListingPublicId,
} from "../lib/listingUtils";

export function PropertyCard({ property }) {
  const { t } = useTranslation();
  const publicId = getListingPublicId(property);
  const images = getListingImages(property);
  const detailPath = publicId ? `/properties/${encodeURIComponent(publicId)}` : "/properties";
  const location = getListingLocation(property);
  const title = property.title || (property.titleKey ? t(property.titleKey) : `${formatLabel(property.asset_type || property.typeKey)} in ${property.city || "selected location"}`);
  const price = property.price_amount ?? property.price;

  return (
    <article className="group overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link to={detailPath} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={images[0]} alt={title} />
          {property.verified_badge_status && (
            <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-forest shadow-sm">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {formatLabel(property.verified_badge_status)}
            </span>
          )}
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-forest">
              {property.asset_type ? formatLabel(property.asset_type) : property.typeKey ? t(property.typeKey) : "Listing"}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-ink/60">
              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
              {formatLabel(property.listing_purpose || "sale")}
            </span>
          </div>
          <Link to={detailPath} className="text-lg font-semibold leading-tight text-ink hover:text-forest">
            {title}
          </Link>
          <p className="mt-2 flex items-center gap-1 muted">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {location || (property.locationKey ? t(property.locationKey) : "Location available on request")}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 border-y border-ink/10 py-3 text-xs text-ink/65">
          <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{property.bedrooms ?? "—"}</span>
          <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{property.bathrooms ?? "—"}</span>
          <span className="flex items-center gap-1"><Ruler className="h-4 w-4" />{property.size_value || "—"} {property.size_unit || ""}</span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="text-sm text-ink/60">
            <span className="text-xl font-semibold text-ink">{formatMoney(price, property.currency_code, property.price_period)}</span>
          </p>
          <Link to={detailPath} className="btn-secondary">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
