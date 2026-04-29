import { Bath, BedDouble, Heart, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";

export function PropertyCard({ property }) {
  const { t, formatCurrency, formatNumber } = useTranslation();

  return (
    <article className="group overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link to={`/properties/${property.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={property.images[0]} alt={t(property.titleKey)} />
          <button className="absolute end-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition hover:text-forest" aria-label={t("nav.saved")}>
            <Heart className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-forest">{t(property.typeKey)}</span>
            <span className="flex items-center gap-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
              {formatNumber(property.rating)}
            </span>
          </div>
          <Link to={`/properties/${property.id}`} className="text-lg font-semibold leading-tight text-ink hover:text-forest">
            {t(property.titleKey)}
          </Link>
          <p className="mt-2 flex items-center gap-1 muted">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {t(property.locationKey)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 border-y border-ink/10 py-3 text-xs text-ink/65">
          <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{formatNumber(property.bedrooms)}</span>
          <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{formatNumber(property.bathrooms)}</span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="text-sm text-ink/60">
            {t("common.from")} <span className="text-xl font-semibold text-ink">{formatCurrency(property.price)}</span>
          </p>
          <Link to={`/inquiry/${property.id}`} className="btn-secondary">
            {t("common.reserve")}
          </Link>
        </div>
      </div>
    </article>
  );
}
