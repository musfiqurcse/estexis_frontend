import { ArrowLeft, Bath, BedDouble, MapPin, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BookingCard } from "../components/BookingCard";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyGallery } from "../components/PropertyGallery";
import { properties } from "../data/properties";
import { useTranslation } from "../i18n";

export function PropertyDetailsPage() {
  const { id } = useParams();
  const { t, formatNumber } = useTranslation();
  const property = properties.find((item) => item.id === id) || properties[0];
  const similar = properties.filter((item) => item.id !== property.id).slice(0, 3);

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
              {t(property.locationKey)}
            </p>
            <h1 className="text-3xl font-semibold md:text-5xl">{t(property.titleKey)}</h1>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-ink/70">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" />{formatNumber(property.rating)} · {formatNumber(property.reviews)} {t("common.reviews")}</span>
              <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{formatNumber(property.bedrooms)} {t("common.bedrooms")}</span>
              <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{formatNumber(property.bathrooms)} {t("common.bathrooms")}</span>
            </div>
          </div>
          <div className="grid gap-8 py-8">
            <section>
              <h2 className="mb-3 text-xl font-semibold">{t("details.description")}</h2>
              <p className="max-w-3xl leading-7 text-ink/70">{t(property.descriptionKey)}</p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold">{t("details.amenities")}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <span key={amenity} className="rounded-lg border border-ink/10 bg-white p-4 text-sm font-medium">
                    {t(`amenities.${amenity}`)}
                  </span>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-ink/10 bg-white p-5">
              <h2 className="text-xl font-semibold">{t("details.host")} {property.host}</h2>
              <p className="mt-2 muted">{t("home.subtitle")}</p>
            </section>
          </div>
        </section>
        <BookingCard property={property} />
      </div>
      <section className="mt-12">
        <h2 className="mb-6 section-title">{t("details.similar")}</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {similar.map((item) => (
            <PropertyCard key={item.id} property={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
